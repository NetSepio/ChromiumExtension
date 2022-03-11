/*global chrome*/
import React, { useState, useEffect } from 'react';
import { Grid, Typography, Paper } from '@mui/material';
import Input from '../../common/Input/Input';
import DashboardStyles from '../DashboardStyles';
import TextArea from '../../common/textarea/TextArea';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { NFTStorage, File } from 'nft.storage';
import { ProfileService } from '../../services/profileService';
import CustomDropdown from '../../common/dropdown/CustomDropdown';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  category,
  siteTypeArr,
  siteTagArr,
  siteSafetyArr,
} from '../../common/dropdown/helper/data';
import { useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';
import Loader from '../../common/Loader';

const _ProfileService = new ProfileService();

const Review = ({ goBack }) => {
  const styles = DashboardStyles();
  const { walletAddress } = useSelector((state) => state?.project);
  const { enqueueSnackbar } = useSnackbar();
  const [loader, setLoader] = useState(false);
  const [metaContent, setMetaContent] = useState({
    title: '',
    description: '',
  });
  const [review, setReview] = useState({
    category: { value: 'Website' },
    domainAddress: 'test.com',
    siteUrl: '',
    siteType: { value: '' },
    siteTag: { value: '' },
    siteSafety: { value: '' },
    metaDataUri: '',
    voter: '',
  });
  let [title, setTitle] = useState('');
  const [screenShot, setScreenShot] = useState('');
  // graphQl stuff

  // ending
  //
  const apiKey = process.env.REACT_APP_API_URL;
  const client = new NFTStorage({ token: apiKey });

  const onChange = (e) => {
    switch (e.target.name) {
      case 'title':
        setMetaContent({ ...review, title: e.target.value });
        break;
      case 'description':
        setMetaContent({ ...review, description: e.target.value });
        break;
      case 'url':
        setMetaContent({ ...review, url: e.target.value });
        break;
      default:
        break;
    }
  };

  const handleSubmitReview = async () => {
    try {
      setLoader(true);
      const metadata = await client.store({
        ...metaContent,
        name: `${metaContent?.title}s`,
        image: new File(
          [
            /* data */
          ],
          'pinpie.jpg',
          { type: 'image/jpg' }
        ),
      });
      setReview({ ...review, metaDataUri: metadata?.url });
      try {
        const { data } = await _ProfileService.createReview({
          category: review.category.value,
          domainAddress: review?.domainAddress,
          siteUrl: review?.siteUrl,
          siteType: review?.siteType?.value,
          siteTag: review?.siteTag?.value,
          siteSafety: review?.siteSafety?.value,
          metaDataUri: metadata?.url,
          voter: walletAddress,
        });
        if (data?.status === 200) {
          setLoader(false);
          enqueueSnackbar('Review successfully created', {
            variant: 'success',
          });
          setReview({
            category: { value: 'Website' },
            domainAddress: 'test.com',
            siteUrl: '',
            siteType: { value: '' },
            siteTag: { value: '' },
            siteSafety: { value: '' },
            metaDataUri: '',
            voter: '',
          });
          setMetaContent({
            title: '',
            description: '',
          });
        }
      } catch (error) {
        setLoader(false);
        enqueueSnackbar('Something went wrong', {
          variant: 'error',
        });
        console.log(error);
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  const handleChange = (type, val) => {
    switch (type) {
      case 'category':
        setReview({ ...review, category: val });
        break;
      case 'siteType':
        setReview({ ...review, siteType: val });
        break;
      case 'siteTag':
        setReview({ ...review, siteTag: val });
        break;
      case 'siteSafety':
        setReview({ ...review, siteSafety: val });
        break;
      case 'siteUrl':
        setReview({ ...review, siteUrl: val?.target?.value });
      default:
        break;
    }
  };

  /* eslint-disable no-undef */
  useEffect(() => {
    async function onStartCapture() {}
    onStartCapture();
  }, []);

  useEffect(() => {
    console.log(screenShot, 'screenshot');
  }, [screenShot]);
  return (
    <Grid container direction="column" alignItems="flex-start">
      <Grid
        item
        container
        justifyContent="center"
        alignItems="center"
        className={styles.mainReviewContainer}
      >
        {loader && <Loader />}
        <Grid item className={styles.reviewContainer}>
          <Grid
            item
            container
            sm
            style={{ marginBottom: '0.5rem' }}
            alignItems="center"
          >
            <Grid item xs={4}>
              <ArrowBackIcon onClick={goBack} />
            </Grid>
            <Grid item>
              <Typography variant="h5" className={styles.commonFont}>
                Write Review
              </Typography>
            </Grid>
          </Grid>
          <Grid item className={styles.commonItem}>
            <Input
              name="title"
              label="Title"
              placeholder="Short but informative title"
              value={metaContent.title}
              onChange={onChange}
            />
          </Grid>
          <Grid item className={styles.commonItem}>
            <TextArea
              name="description"
              rows="2"
              placeholder="Brief description of the website"
              label="Description"
              value={metaContent.description}
              onChange={onChange}
            />
          </Grid>
          <Grid item className={styles.commonItem}>
            <Input
              name="siteUrl"
              label="Website URL"
              placeholder="https://example.com"
              value={review?.siteUrl}
              onChange={(event) => handleChange('siteUrl', event)}
            />
          </Grid>
          <Grid item className={styles.commonItem}>
            <CustomDropdown
              label="Category"
              options={category}
              value={review?.category}
              handleChangeService={(event, newVal) =>
                handleChange('category', newVal)
              }
            />
          </Grid>
          <Grid item className={styles.commonItem}>
            <CustomDropdown
              label="Site Type"
              placeHolder="Select site type"
              options={siteTypeArr}
              value={review?.siteType}
              handleChangeService={(event, newVal) =>
                handleChange('siteType', newVal)
              }
            />
          </Grid>
          <Grid item className={styles.commonItem}>
            <CustomDropdown
              label="Site Tag"
              placeHolder="Select site tag"
              options={siteTagArr}
              value={review?.siteTag}
              handleChangeService={(event, newVal) =>
                handleChange('siteTag', newVal)
              }
            />
          </Grid>
          <Grid item className={styles.commonItem}>
            <CustomDropdown
              label="Site Safety"
              placeHolder="Select site safety"
              options={siteSafetyArr}
              value={review?.siteSafety}
              handleChangeService={(event, newVal) =>
                handleChange('siteSafety', newVal)
              }
            />
          </Grid>
          {/* <Grid item className={styles.commonItem}>
            <Input
              name="screenShot"
              label="ScreenShot"
              placeholder="ScreenShot"
              // value={url}
              // onChange={onChange}
            />
          </Grid> */}
          <Grid item style={{ marginTop: '0.5rem' }}>
            <Typography align="center">
              {' '}
              <LoadingButton
                onClick={handleSubmitReview}
                loadingPosition="center"
                variant="contained"
                sx={{ minWidth: '90%', height: '35px' }}
              >
                Submit
              </LoadingButton>
            </Typography>
          </Grid>
          {/* <img src={screenShot}/> */}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Review;
