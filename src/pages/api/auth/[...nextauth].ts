import { query as q } from 'faunadb'

import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";

//services
import { fauna } from '../../../services/fauna'

export default NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'read:user',
        },
      },
    }),


  ],

  // jwt: {
  //   signingKey: process.env.SIGING_KEY
  // },
  callbacks: {
    async signIn({ user, account, profile, credentials }) {
      const { email } = user

      console.log('user', user)
      try {

        await fauna.query(

          q.If(
            q.Not(
              q.Exists(
                q.Match(
                  q.Index('user_by_email'),
                  q.Casefold(user.email)
                )
              )
            ),
            q.Create(
              q.Collection('users'),
              { data: { email } }
            ),
            q.Get(
              q.Match(
                q.Index('user_by_email'),
                q.Casefold(user.email)
              )
            )
          )
        )

        return true

      } catch (err) {
        console.log(err)

        return false
      }

    },
  },



});