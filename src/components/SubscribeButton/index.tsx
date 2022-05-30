import { useSession, signIn } from 'next-auth/react'
import { api } from 'src/services/api';
import { getStripeJs } from 'src/services/stripe-js';
import styles from './styles.module.scss'


interface ISubscribeButtonProps {

  priceId: string

}


export function SubscribeButton({ priceId }: ISubscribeButtonProps) {
  const { data: session } = useSession();

  async function handleSubscribe() {
    if (!session) {
      signIn('GitHubProvider')
      return;
    }

    //criação do checkout session

    try {
      const response = await api.post('/subscribe')
      const { sessionId } = response.data;

      const stripe = await getStripeJs()

      await stripe.redirectToCheckout({sessionId})

    } catch (err) {

      alert(err.message)
    }
  }

  return (

    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>

  )

}