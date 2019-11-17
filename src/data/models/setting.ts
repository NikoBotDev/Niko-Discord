import {
  Column,
  Model,
  Table,
  PrimaryKey,
  AllowNull,
  DataType
} from 'sequelize-typescript';
@Table({ timestamps: false })
export default class Settings extends Model<Settings> {
  @Column(DataType.STRING)
  @PrimaryKey
  public guildId!: string;
  @Column(DataType.JSON)
  @AllowNull(true)
  public settings!: any;
}
