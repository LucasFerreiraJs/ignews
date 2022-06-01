import { fauna } from "src/services/fauna"
import { query as q } from 'faunadb'
import { stripe } from "src/services/stripe"
export async function saveSubscription(
  subscriptionId: string,
  customerId: string,
  createAction =  false,
) {

  console.log('teste teste teste', subscriptionId, customerId)
  //buscar usuário no bando com id
  const userRef = await fauna.query(
    q.Select(
      'ref',
      q.Get(
        q.Match(
          q.Index('user_by_stripe_customer_id'),
          customerId
        )
      )
    )
  )



  //salvar dados da subscription no banco
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  const subscriptionData = {
    id: subscription.id,
    userId: userRef,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id
  }


  if(createAction){

    await fauna.query(
      q.Create(
        q.Collection('subscriptions'),
        { data: subscriptionData }
      )
    )
  }else{

    await fauna.query(
      q.Replace(
        q.Select(
          "ref",
          q.Get(
            q.Match(
              q.Index('subscription_by_id'),
              subscriptionId,
            )
          )
        ),
        {data: subscriptionData}
      )
    )
  }


}