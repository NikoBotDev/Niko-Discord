import {
  Column,
  Model,
  Table,
  AllowNull,
  DataType
} from 'sequelize-typescript';

@Table({
  indexes: [
    {
      name: 'tag_name_guildId',
      unique: true,
      fields: ['name', 'guildId']
    }
  ]
})
export default class Tag extends Model<Tag> {
  @Column({
    type: DataType.STRING({ length: 20 }),
    validate: {
      len: [3, 20]
    }
  })
  @AllowNull(false)
  public name!: string;

  @Column({
    type: DataType.TEXT({ length: 'medium' }),
    validate: {
      len: [10, 1000]
    }
  })
  @AllowNull(false)
  public content!: string;

  @AllowNull(false)
  public guildId!: string;

  @AllowNull(false)
  public userId!: string;
}
