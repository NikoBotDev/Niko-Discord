import {
  Column,
  Model,
  Table,
  PrimaryKey,
  Default,
  Scopes,
  AllowNull,
  DataType
} from 'sequelize-typescript';
@Scopes(() => ({
  rank: {
    attributes: ['userId', 'xp', 'level', 'coins'],
    order: [
      ['level', 'DESC'],
      ['xp', 'DESC']
    ]
  }
}))
@Table({ timestamps: false })
export class Profile extends Model<Profile> {
  @Column(DataType.TEXT)
  @PrimaryKey
  public userId!: string;
  @Column(DataType.INTEGER)
  @Default(1)
  public level!: number;

  @Column(DataType.INTEGER)
  @Default(1)
  public xp!: number;

  @Column({
    type: DataType.INTEGER,
    validate: {
      min: 0
    }
  })
  @Default(0)
  public coins!: number;

  @Column(DataType.TEXT)
  @AllowNull
  public married!: string;

  @Column(DataType.STRING)
  @Default('default')
  public profile_bg!: string;

  @Column(DataType.JSON)
  @Default([])
  public badges!: string[];
  @Column(DataType.INTEGER({ length: 1 }))
  @Default(0)
  public streak!: number;
}

export default Profile;
