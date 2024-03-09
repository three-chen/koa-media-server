import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm'
import { User } from './User'

@Entity()
@Unique(['alias'])
export class Room {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  alias: string

  @ManyToOne(() => User)
  @JoinColumn()
  owner: User
}
