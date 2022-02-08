import "reflect-metadata";
import { Service } from 'typedi'
import { User } from '../model/User'

@Service()
export class UserRepository {
  private userList = [new User(1, 'User 1'), new User(2, 'User 2'), new User(3, 'User 3')]

  queryAll() {
    return this.userList
  }

  query(id: number) {
    let foundUser: User = undefined
    this.userList.forEach((user) => {
      if (user.id === id) foundUser = user
    })
    return foundUser
  }

  insert(input: any) {
    const user = typeof input !== 'undefined' ? new User(input.id, input.name) : new User(-1, '')
    this.userList.push(user)
    return user
  }

  delete(id: number) {
    const user = this.query(id)
    if (typeof user !== 'undefined') {
      this.userList.splice(this.userList.indexOf(user), 1)
    }

    return user
  }
}
