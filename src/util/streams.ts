import axios from 'axios';
import { MessageEmbed, ColorResolvable } from 'discord.js';
const { TWITCH_KEY } = process.env;
async function getStreamData(username: string) {
  try {
    const res = await axios.get(
      `https://api.twitch.tv/kraken/streams/${encodeURIComponent(
        username
      )}?client_id=${TWITCH_KEY}`,
      {
        responseType: 'json'
      }
    );
    if (res.status !== 200) return null;
    return res.data;
  } catch (err) {
    return null;
  }
}

function getAlertEmbed(data: any) {
  const {
    stream: {
      game,
      channel: { display_name, status, url, logo, followers, views }
    }
  } = data;
  const embed = new MessageEmbed()
    .setColor(0x802bff)
    .setTitle(display_name)
    .setDescription(`[${status || 'No title'}](${url})`)
    .setThumbnail(
      logo ||
        'https://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_70x70.png'
    )
    .addField('Game', game || 'Games & Demos')
    .addField('Followers', followers, true)
    .addField('Views', views, true)
    .setTimestamp();
  return embed;
}
function getOfflineEmbed(username: string, color: ColorResolvable) {
  return new MessageEmbed()
    .setColor(color)
    .setAuthor(username, `https://twitch.tv/${username}`)
    .setDescription(`\`${username}\` ended the stream.`)
    .setTimestamp();
}
export { getStreamData, getAlertEmbed, getOfflineEmbed };
