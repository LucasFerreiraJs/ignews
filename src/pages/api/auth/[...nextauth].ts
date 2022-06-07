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
    async session({ session }) {
      try {
        // console.log('try')

        // console.log('try session', session)
        // const ref = await fauna.query(

        //   q.Get(
        //     q.Match(
        //       q.Index('subscription_by_user_ref'),
        //       q.Select(
        //         "ref",
        //         q.Get(
        //           q.Match(
        //             q.Index("user_by_email"),
        //             q.Casefold(session.user.email)
        //           )
        //         )
        //       )
        //     )
        //   )

        // )


        // console.log('ref', ref)
        // const active = await fauna.query(

        //   q.Get(
        //     q.Match(
        //       q.Index('subscription_by_status'),
        //       "active"
        //     )

        //   )

        // )


        // console.log('try active', active)

        const userActiveSubsciprion = await fauna.query(

          q.Get(
            q.Intersection([
              q.Match(
                q.Index('subscription_by_user_ref'),
                q.Select(
                  "ref",
                  q.Get(
                    q.Match(
                      q.Index("user_by_email"),
                      q.Casefold(session.user.email)
                    )
                  )
                )
              ),
              q.Match(
                q.Index('subscription_by_status'),
                "active"
              )
            ])
          )

        )


        return {
          ...session,
          activeSubscription: userActiveSubsciprion

        }

      } catch (err) {

        console.log('err: ', err)
        return {
          ...session,
          activeSubscription: null

        }
      }


    },
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