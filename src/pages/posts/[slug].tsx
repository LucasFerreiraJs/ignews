import { GetServerSideProps } from "next"
import { getSession } from 'next-auth/react'
import { RichText } from "prismic-dom"
import { getPrismicClient } from "src/services/prismic"
import Head from 'next/head'
import styles from './post.module.scss'

interface IPostProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  }

}



export default function Post({ post }: IPostProps) {

  return (
    <>
      <Head>
        <title>{post.title} | ignews</title>

      </Head>

      <main className={styles.container}>

        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt} </time>

          <div className={styles.postContent} dangerouslySetInnerHTML={{__html: post.content}}/>

        </article>
      </main>


    </>

  )

}


export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {

  const session = await getSession({ req })
  console.log('session', session)


  const slug = params?.slug

  // console.log('slug', slug)

  if(!session?.activeSubscription){
    return {
      redirect:{
        destination: '/',
        permanent : false

      }
    }
  }



  const prismic = getPrismicClient(req)

  // console.log('prismic ', prismic)


  const response = await prismic.getByUID('publication', String(slug).replace('}',''), {})




  const post = {
    slug: slug,
    title: RichText.asText(response?.data.title),
    content: RichText.asHtml(response?.data.content),
    updatedAt: new Date(response?.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'

    })

  }


  return {
    props: {
      post
    }
  }
}