import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

import argon2 from 'argon2'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ select: false })
  password: string

  @Column()
  email: string

  @Column()
  role: string

  @BeforeInsert()
  async hashPasswordBeforeInsert() {
    this.password = await argon2.hash(this.password)
  }
}
