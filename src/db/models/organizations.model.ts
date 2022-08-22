import { Schema, model, Types } from 'mongoose'
import * as countries from 'country-list'
import { filter, from, take } from 'rxjs'
import { Mongo } from '../mongo'

interface ICountry {
  code: string
  name: string
}
export const Countries = {
  list: (): ICountry[] => countries.getData(),
  find: (codeOrName: string): ICountry => {
    if (codeOrName.length === 2) {
      let found = countries.getCodeList()[codeOrName.toLowerCase()]
      if (found)
        return {
          code: codeOrName.toUpperCase(),
          name: found,
        }
    } else {
      let found = countries.getNameList()[codeOrName.toLowerCase()]
      if (found)
        return {
          code: found.toUpperCase(),
          name: countries.getName(found.toUpperCase()),
        }
    }
    return null
  },
}

export const Roles = ['Member', 'Editor', 'Accountant', 'Admin']

export interface IMember {
  member: Types.ObjectId
  role: string
}

export interface IPublicOrganization {
  displayName: string
  created: Date
}
export interface IOrganization {
  _id: Types.ObjectId

  displayName: string

  owner: Types.ObjectId
  members: IMember[]

  legalName?: string
  country?: object
  vat?: string

  created: Date

  addOrUpdateMember: (member: IMember) => {}
  removeMember: (member: IMember | Types.ObjectId) => {}

  /**
   * Returns public information for the organization.
   **/
  public(): IPublicOrganization
  isOwner(user): boolean
}
export const organizationsSchema: Schema = new Schema({
  displayName: {
    type: String,
    required: true,
    unique: true,
  },

  owner: {
    type: Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  members: {
    type: [Object],
    required: true,
    default: [],
  },

  legalName: String,
  country: {
    type: Object,
    enum: Countries,
  },
  vat: String,

  created: {
    type: Date,
    default: Date.now(),
  },
})

organizationsSchema.pre('save', async function (next) {
  if (this.country) {
    let found = await from(Countries.list())
      .pipe(
        filter(
          (c: any) =>
            c.code === this.country.code && c.name === this.country.name
        ),
        take(1)
      )
      .toPromise()
    if (found) return next()
    else throw new Error('Not a valid country')
  } else if (this.members?.length > 0) {
    for (let m of this.members)
      if (!Roles.includes(m.role)) throw new Error('Not a valid role')
  }
  next()
})

organizationsSchema.methods.addOrUpdateMember = async function (
  member: IMember
) {
  let found = await from(this.members)
    .pipe(
      filter(
        (m: IMember) =>
          Mongo.ObjectId(m.member) === Mongo.ObjectId(member.member)
      ),
      take(1)
    )
    .toPromise()

  if (found) found.role = member.role
  else this.members.push(member)
}

organizationsSchema.methods.removeMember = async function (
  member: IMember | Types.ObjectId
) {
  let found = await from(this.members)
    .pipe(
      //@ts-ignore
      filter((m: IMember) =>
        //@ts-ignore
        Mongo.ObjectId(m.member) === member.member
          ? //@ts-ignore
            Mongo.ObjectId(member.member)
          : member
      ),
      take(1)
    )
    .toPromise()

  if (found) this.members.splice(this.members.indexOf(found), 1)
}

//TODO add a changeOwnership method

organizationsSchema.methods.public = function () {
  return {
    displayName: this.displayName,
  }
}
organizationsSchema.methods.isOwner = function (userId) {
  return this.owner === Mongo.ObjectId(userId)
}

export const Organizations = model<IOrganization>(
  'Organizations',
  organizationsSchema
)
