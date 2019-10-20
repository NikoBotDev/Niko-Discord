const {
  Command,
  Argument: { validate }
} = require('discord-akairo');

const { MessageEmbed } = require('discord.js');

const sherlock = require('sherlockjs');

const formatDistance = require('date-fns/formatDistance');

class MuteCommand extends Command {
  constructor() {
    super('mute', {
      aliases: ['mute'],
      category: 'admin',
      description: {
        content: 'Blocks a member from speaking in this server.',
        usage: '<member> [reason]',
        examples: ['@toxicmember he is toxic']
      },
      ratelimit: 2,
      clientPermissions: ['KICK_MEMBERS', 'MANAGE_CHANNELS'],
      userPermissions: ['KICK_MEMBERS'],
      args: [
        {
          id: 'member',
          type: validate(
            'member',
            member => member.id !== member.guild.ownerID && member.kickable
          ),
          prompt: {
            start: 'What member you want to mute?\n',
            retry: "I can't find or mute that user, maybe pick another one?"
          }
        },
        {
          id: 'time',
          prompt: {
            start: 'Until when the user will be muted?\n'
          }
        },
        {
          id: 'reason',
          type: validate('string', reason => reason.length <= 1200),
          match: 'rest'
        }
      ]
    });
  }

  async exec(msg, { member, time, reason }) {
    // Check if the user already is muted
    const isMuted = await this.client.db.mutes.findOne({
      where: {
        userId: member.id,
        guildId: msg.guild.id
      }
    });

    const muteRoleId = this.client.settings.get(msg.guild.id, 'muteRoleId');

    if (isMuted) {
      if (!muteRoleId) {
        // If the role id isn't set then destroy the record
        await isMuted.destroy();
        return null;
      }
      if (!member.roles.has(muteRoleId)) {
        /* If the id is set and the user doesn't have the role
                    add it to the member
                */
        await member.roles.add(muteRoleId, 'Still muted');
        return null;
      }
    }
    // Mute the user

    let muteRole = null;
    if (!muteRoleId) {
      muteRole = await this.getRoleOrCreate(msg);
      if (!muteRole) return null;
      // Assign the role as mute role for this server
      await this.client.settings.set(msg.guild.id, 'muteRoleId', muteRole.id);
      // Loop through all the channels and change their permissions for Mute Role
      const { channels } = msg.guild;
      await this.changePermissions(channels, muteRole.id);
    }
    // Now the role exists lets get it
    muteRole = msg.guild.roles.get(muteRoleId);
    // Parse the end time using sherlock
    const endDate = sherlock.parse(time);
    // Add the role to the muted member
    await member.roles.add(muteRole, { reason });

    // Add mute to the database

    await this.client.db.mutes.create({
      userId: member.id,
      modId: msg.member.id,
      guildId: msg.guild.id,
      endDate: endDate.startDate.getTime()
    });
    // Make reply embed
    const embed = new MessageEmbed()
      .setColor(this.client.colors.ok)
      .setTitle(__('default+action', { action: 'Mute' }))
      .setThumbnail(member.user.displayAvatarURL())
      .setDescription(
        __('command.mute.muted', {
          username: member.user.username,
          id: member.id
        })
      )
      .addField(__('default+reason'), reason)
      .addField(
        __('command.mute.time'),
        formatDistance(new Date(endDate.startDate), new Date(), {
          addSuffix: true
        })
      )
      .setFooter(msg.author.tag, msg.author.displayAvatarURL());
    return msg.util.send(embed);
  }

  async getRoleOrCreate(msg) {
    let muteRole = msg.guild.roles.find(
      role => role.name.toLowerCase() === 'muted'
    );
    if (muteRole) return muteRole;
    if (!msg.guild.me.permissions.has('MANAGE_ROLES')) {
      msg.reply(
        `I can't make a mute role for this action,
                please do it yourself`
      );
      return null;
    }
    muteRole = await msg.guild.roles
      .create({
        data: {
          name: 'Muted',
          permissions: 0
        },
        reason: 'Role needed for mute command'
      })
      .catch(() => null);
    if (!muteRole) {
      msg.reply(`Something went wrong while making the role, sorry...`);
      return null;
    }
    return muteRole;
  }

  async changePermissions(channels, muteRoleId) {
    for (const channel of channels.values()) {
      try {
        if (channel.type === 'text') {
          channel.overwritePermissions({
            permissionOverwrites: [
              {
                id: muteRoleId,
                deny: ['SEND_MESSAGES', 'ADD_REACTIONS']
              }
            ]
          });
        } else if (channel.type === 'voice') {
          channel.overwritePermissions({
            permissionOverwrites: [
              {
                id: muteRoleId,
                deny: ['SPEAK', 'CONNECT']
              }
            ]
          });
        }
      } catch (err) {
        /* eslint-disable-line no-empty */
      }
    }
  }
}

module.exports = MuteCommand;
