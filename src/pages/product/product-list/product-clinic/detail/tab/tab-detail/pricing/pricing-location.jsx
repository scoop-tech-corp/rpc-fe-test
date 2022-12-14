import { Button, FormControl, Grid, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import { useContext, useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { DeleteFilled, PlusOutlined } from '@ant-design/icons';
import IconButton from 'components/@extended/IconButton';
import ProductClinicDetailContext from '../../../product-clinic-detail-context';
import NumberFormatCustom from 'utils/number-format';

const PricingLocation = () => {
  const { productClinicDetail, setProductClinicDetail } = useContext(ProductClinicDetailContext);
  const [pricingLocation, setPricingLocation] = useState([]);
  const locationDropdown = productClinicDetail.dataSupport.locationList;

  useEffect(() => {
    setPricingLocation(productClinicDetail.priceLocations);
  }, [productClinicDetail.priceLocations]);

  const onSelectLocation = (event, i) => {
    setPricingLocation((value) => {
      const getData = [...value];
      getData[i].locationId = event.target.value;

      setProductClinicDetail((val) => {
        return { ...val, priceLocations: getData };
      });

      return getData;
    });
  };

  const onPrice = (event, i) => {
    const getPrice = +event.target.value.replace(',', '');

    setPricingLocation((value) => {
      const getData = [...value];
      getData[i].price = getPrice;

      setProductClinicDetail((val) => {
        return { ...val, priceLocations: getData };
      });

      return getData;
    });
  };

  const onAddLocation = () => {
    setPricingLocation((value) => {
      const setNewData = [...value, { locationId: '', price: '' }];

      setProductClinicDetail((val) => {
        return { ...val, priceLocations: setNewData };
      });
      return setNewData;
    });
  };

  const onDeleteLocation = (i) => {
    setPricingLocation((value) => {
      const setNewData = [...value];
      setNewData.splice(i, 1);

      setProductClinicDetail((val) => {
        return { ...val, priceLocations: setNewData };
      });
      return setNewData;
    });
  };

  return (
    <>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={10}>
          {pricingLocation.map((dt, i) => (
            <Grid container spacing={4} key={i}>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1} style={{ marginTop: '5px' }}>
                  <InputLabel htmlFor="location">
                    <FormattedMessage id="location" />
                  </InputLabel>
                  <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <Select
                      id={`location${i}`}
                      name={`location${i}`}
                      value={dt.locationId}
                      onChange={(event) => onSelectLocation(event, i)}
                    >
                      <MenuItem value="">
                        <em>Select location</em>
                      </MenuItem>
                      {locationDropdown.map((dt, idx) => (
                        <MenuItem value={dt.value} key={idx}>
                          {dt.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={5}>
                <Stack spacing={1} style={{ marginTop: '5px' }}>
                  <InputLabel>
                    <FormattedMessage id="price" />
                  </InputLabel>
                  <TextField
                    fullWidth
                    id={`price${i}`}
                    name={`price${i}`}
                    value={dt.price}
                    onChange={(event) => onPrice(event, i)}
                    InputProps={{
                      startAdornment: 'Rp',
                      inputComponent: NumberFormatCustom
                    }}
                  />
                </Stack>
              </Grid>

              <Grid item xs={12} sm={1} display="flex" alignItems="flex-end">
                <IconButton size="large" color="error" onClick={() => onDeleteLocation(i)}>
                  <DeleteFilled />
                </IconButton>
              </Grid>
            </Grid>
          ))}

          <Button variant="contained" onClick={onAddLocation} startIcon={<PlusOutlined />} style={{ marginTop: '20px' }}>
            Add
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default PricingLocation;
