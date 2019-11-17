import {
  Column,
  Model,
  Table,
  PrimaryKey,
  Default,
  AllowNull,
  DataType
} from 'sequelize-typescript';
@Table({
  indexes: [
    {
      name: 'mute_guildId_userId',
      unique: true,
      fields: ['userId', 'guildId']
    }
  ]
})
export default class Mute extends Model<Mute> {
  @Column(DataType.UUID)
  @Default(DataType.UUIDV4)
  @PrimaryKey
  public id!: string;

  @Column(DataType.TEXT)
  @AllowNull(false)
  public userId!: string;

  @Column(DataType.TEXT)
  @AllowNull(false)
  public modId!: string;

  @Column(DataType.TEXT)
  @AllowNull(false)
  public guildId!: string;

  @Column(DataType.DATE)
  @AllowNull(false)
  public endDate!: Date;
}
