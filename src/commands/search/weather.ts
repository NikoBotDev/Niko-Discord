import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';
import { stringify } from 'querystring';
import { getJSON } from '../../util/requests';
export default class WeatherCommand extends Command {
  constructor() {
    super('weather', {
      aliases: ['weather'],
      category: 'search',
      clientPermissions: ['EMBED_LINKS'],
      description: {
        content: 'Get weather data for your city.',
        usage: '<city name>',
        examples: ['Londres, UK', 'New York']
      },
      args: [
        {
          id: 'city',
          description: 'City to fetch the weather data.',
          match: 'content',
          prompt: {
            start: 'What city you want to see weather data?\n'
          }
        }
      ]
    });
  }

  public async exec(msg: Message, { city }: { city: string }) {
    try {
      const data = await this.getWeather(city);
      const {
        id,
        name,
        sys: { country, sunset, sunrise },
        coord: { lat, lon },
        weather,
        main: { humidity, temp, temp_max, temp_min },
        wind: { speed }
      } = data;
      const embed = new MessageEmbed()
        .setColor(this.client.colors.ok)
        .addField(
          '🌎 Location',
          `[${name}, ${country}](https://openweathermap.org/city/${id})`,
          true
        )
        .addField('🔎 Lat/Lon', `${lat}/${lon}`, true)
        .addField('☁ Condition', weather[0].main, true)
        .addField('💧 Humidity', `${humidity} %`, true)
        .addField('💨 Wind Speed', `${speed} m/s`, true)
        .addField('🌡 Temperature', `${temp} °C`, true)
        .addField('☀ Min/Max', `${temp_min} °C - ${temp_max} °C`, true)
        .addField('🌅 Sunset', sunset, true)
        .addField('🌄 Sunrise', sunrise, true)
        .setFooter(
          weather[0].description,
          `http://openweathermap.org/img/w/${weather[0].icon}.png`
        );
      msg.util!.send('', embed);
    } catch (err) {
      return msg.reply(err);
    }
  }

  private async getWeather(city: string) {
    const query = stringify({
      q: city,
      appid: process.env.WEATHER_KEY,
      units: 'metric'
    });
    const data = await getJSON(
      `http://api.openweathermap.org/data/2.5/weather?${query}`
    );
    if (!data) return Promise.reject(`The ${city} cannot be found...`);
    data.sys.sunrise = this.getFormattedTime(data.sys.sunrise);
    data.sys.sunset = this.getFormattedTime(data.sys.sunset);
    return data;
  }

  private getFormattedTime(time) {
    return `${new Date(time * 1000).toTimeString().split(' ')[0]} UTC`;
  }
}
