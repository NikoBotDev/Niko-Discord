import {
  Column,
  Model,
  Table,
  AllowNull,
  DataType
} from 'sequelize-typescript';
@Table({
  timestamps: false,
  indexes: [
    {
      name: 'userId_index',
      unique: false,
      fields: ['userId']
    }
  ]
})
export default class Reminder extends Model<Reminder> {
  @Column(DataType.TEXT)
  @AllowNull(false)
  public userId!: string;

  @Column(DataType.TEXT)
  @AllowNull(false)
  public guildId!: string;

  @Column(DataType.TEXT)
  @AllowNull(false)
  public channelId?: string;
  @Column({
    type: DataType.TEXT,
    validate: {
      len: [1, 1500]
    }
  })
  @AllowNull(false)
  // tslint:disable-next-line: variable-name
  public _of!: string;

  @Column(DataType.DATE)
  @AllowNull(false)
  // tslint:disable-next-line: variable-name
  public _in!: string;
}
