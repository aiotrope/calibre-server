import * as React from 'react'
import { StyleSheet } from 'react-native'
import { Button, Card, Badge, DataTable } from 'react-native-paper'
import { useParams, useNavigate } from 'react-router-native'
import { useQuery, useMutation } from '@apollo/client'
import Spinner from 'react-native-loading-spinner-overlay'
import moment from 'moment/moment'
import numbro from 'numbro'

import {
  ME,
  REPOSITORIES,
  REPOSITORY,
  REVIEWS,
  REVIEW,
  USERS,
} from '../graphql/queries'
import { DELETE_REVIEW } from '../graphql/mutations'
import { useGeneral } from '../contexts/GeneralContext'

const SingleReview = () => {
  const params = useParams()
  const navigate = useNavigate()
  const { setSuccessMessage, setErrorMessage, mounted } = useGeneral()
  const reviewData = useQuery(REVIEW, {
    variables: { reviewId: params.id },
  })
  const [delete_review, { loading, error, data }] = useMutation(DELETE_REVIEW, {
    refetchQueries: [
      { query: ME },
      { query: REPOSITORIES },
      { query: REPOSITORY },
      { query: REVIEWS },
      { query: REVIEW },
      { query: USERS },
    ],
  })

  React.useEffect(() => {
    const prepare = async () => {
      try {
        if (mounted && data?.deleteReview) {
          setSuccessMessage(`Review deleted`)
          await new Promise((resolve) => setTimeout(resolve, 2000))
          navigate('/profile')
          setSuccessMessage('')
        }
      } catch (error) {
        setErrorMessage(error)
        navigate(`/review/${params.id}`)
        await new Promise((resolve) => setTimeout(resolve, 8000))
        setErrorMessage(error)
      }
    }
    prepare()
  }, [mounted, data?.deleteReview, setSuccessMessage, setErrorMessage])

  React.useEffect(() => {
    if ((mounted && error) || reviewData?.error) {
      setErrorMessage(error?.message)
      let timer
      timer = setTimeout(() => {
        setErrorMessage('')
        navigate(`/review/${params.id}`)
        clearTimeout(timer)
      }, 9000)
    }
  }, [error, mounted, setErrorMessage])

  const handleDeleteReview = async () => {
    try {
      delete_review({ variables: { reviewId: params.id } })
    } catch (error) {
      console.error(error)
    }
  }

  if (loading || reviewData?.loading) {
    return (
      <Spinner
        visible={true}
        textContent={'Deleting...'}
        textStyle={styles.spinnerTextStyle}
      />
    )
  }
  const onProfile = () => {
    navigate('/profile')
  }
  const rate = numbro(reviewData?.data?.review?.rating).format({
    average: true,
  })
  const created = moment(reviewData?.data?.review?.createdAt).format(
    'DD.MM.YYYY'
  )
  return (
    <>
      <Card key={reviewData?.data?.review?.id} style={styles.cardContainer}>
        <Card.Title
          title={`Review for ${reviewData?.data?.review?.repository?.fullName}`}
          titleStyle={{ fontWeight: 'bold' }}
          subtitle={`by ${reviewData?.data?.review?.user?.username} @ ${created}`}
          subtitleNumberOfLines={1000}
          left={() => (
            <Badge size={45} style={{ backgroundColor: '#003f5c' }}>
              {rate}
            </Badge>
          )}
        />
        <Card.Content>
          <DataTable>
            <DataTable.Row>
              <DataTable.Cell>
                {reviewData?.data?.review?.reviewText}
              </DataTable.Cell>
            </DataTable.Row>
          </DataTable>
        </Card.Content>
        <Card.Actions>
          <Button onPress={onProfile} mode="contained-tonal">
            Cancel
          </Button>
          <Button onPress={handleDeleteReview} mode="contained">
            Confirm Delete
          </Button>
        </Card.Actions>
      </Card>
    </>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  container: {
    flex: 1,
  },
  cardContainer: {
    margin: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },

  spinnerTextStyle: {
    color: '#FFFFF',
  },
  separator: {
    height: 10,
  },
})

export default SingleReview
