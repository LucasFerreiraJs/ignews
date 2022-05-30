import { signIn, signOut, useSession } from 'next-auth/react'

import styles from './styles.module.scss'
import { FaGithub } from 'react-icons/fa'
import { FiX } from 'react-icons/fi'



export function SignInButton() {


  const { data: session } = useSession()


  console.log('session', session)

  const isUserLoggedIn = true;


  return session
    ? (
      <button
        type="button"
        className={styles.signInButton}
        onClick={()=> signOut() }
      >
        <FaGithub
          color="#04d361"
        // color="#eba417"
        />
        {session.user.name}
        <FiX className={styles.closeIcon} color="#707080" />
      </button>

    )
    : (

      <button
        type="button"
        className={styles.signInButton}
        onClick={() => signIn('GitHubProvider')}
      >
        <FaGithub
          // color="#04d361"
          color="#eba417"
        />

        Sign in with github
      </button>
    )

}