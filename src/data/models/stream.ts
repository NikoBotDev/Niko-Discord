import {
  Column,
  Model,
  Table,
  Default,
  AllowNull,
  DataType
} from 'sequelize-typescript';

@Table({
  timestamps: false,
  indexes: [
    {
      name: 'streams_channelId_username',
      unique: true,
      fields: ['channelId', 'username']
    }
  ]
})
export default class Stream extends Model<Stream> {
  @Column(DataType.STRING)
  public channelId!: string;

  @Column(DataType.STRING)
  public guildId!: string;

  @Column(DataType.TEXT)
  @AllowNull(true)
  public message!: string;

  @Column({
    type: DataType.STRING,
    validate: {
      isLowercase: true
    }
  })
  @AllowNull(false)
  public username!: string;

  @Column(DataType.BOOLEAN)
  @Default(false)
  public streaming!: boolean;

  @Column(DataType.DATE)
  @Default(new Date().toISOString())
  public startedAt!: Date;
}
