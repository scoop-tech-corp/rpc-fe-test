import { Button, Grid, InputLabel, Stack, TextField } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { DeleteFilled, PlusOutlined } from '@ant-design/icons';
import ProductClinicDetailContext from '../../../product-clinic-detail-context';
import IconButton from 'components/@extended/IconButton';
import NumberFormatCustom from 'utils/number-format';

let erorQuantity = { isError: false, errorType: null };

const PricingQuantity = () => {
  const { productClinicDetail, setProductClinicDetail, setProductClinicDetailError } = useContext(ProductClinicDetailContext);
  const [quantityList, setQuantityList] = useState([]);

  useEffect(() => {
    setQuantityList(productClinicDetail.quantities);
  }, [productClinicDetail.quantities]);

  const validationForm = (procedure, data, i) => {
    let isError = false;

    if (procedure === 'fromQty') {
      // from tidak boleh lebih dari atau sama dengan to
      if (data[i].fromQty >= data[i].toQty) {
        isError = true;
        erorQuantity.isError = true;
        erorQuantity.errorType = 1;
      }

      // from tidak boleh kurang dari atau sama dengan to sebelumnya
      if (i > 0 && data[i].fromQty <= data[i - 1].toQty) {
        isError = true;
        erorQuantity.isError = true;
        erorQuantity.errorType = 3;
      }
    } else if (procedure === 'toQty') {
      // to tidak boleh kurang dari atau sama dengan from
      if (data[i].toQty <= data[i].fromQty) {
        isError = true;
        erorQuantity.isError = true;
        erorQuantity.errorType = 2;
      }
    } else if (procedure === 'price') {
      // price tidak boleh melebihi atau sama dengan price sebelumnya
      if (i > 0 && data[i].price >= data[i - 1].price) {
        isError = true;
        erorQuantity.isError = true;
        erorQuantity.errorType = 4;
      }
    }

    if (!isError) {
      erorQuantity.isError = false;
      erorQuantity.errorType = null;
    }

    return isError;
  };

  const renderErrorContent = () => {
    switch (erorQuantity.errorType) {
      case 1:
        return 'Mohon cek kembali ada from yang melebihi atau sama dengan to nya';
      case 2:
        return 'Mohon cek kembali ada to yang kurang atau sama dengan from nya';
      case 3:
        return 'Mohon cek kembali ada from yang kurang atau sama dengan to sebelum nya';
      case 4:
        return 'Mohon cek kembali ada price yang melebihi price sebelum nya';
    }
  };

  const processFrom = (key, getValue, i) => {
    setQuantityList((value) => {
      const getData = [...value];
      getData[i][key] = getValue;

      const conditionFrom = validationForm(key, getData, i);

      setProductClinicDetailError(conditionFrom);
      setProductClinicDetail((val) => {
        return { ...val, quantities: getData };
      });

      return getData;
    });
  };

  const onFromQty = (e, i) => {
    const getValue = +e.target.value;
    processFrom('fromQty', getValue, i);
  };

  const onToQty = (e, i) => {
    const getValue = +e.target.value;
    processFrom('toQty', getValue, i);
  };

  const onPrice = (e, i) => {
    const getValue = +e.target.value.replace(',', '');
    processFrom('price', getValue, i);
  };

  const onAddQty = () => {
    setQuantityList((value) => {
      const setNewData = [...value, { fromQty: '', toQty: '', price: '' }];

      setProductClinicDetail((val) => {
        return { ...val, quantities: setNewData };
      });
      return setNewData;
    });
  };

  const onDeleteQty = (i) => {
    setQuantityList((value) => {
      const setNewData = [...value];
      setNewData.splice(i, 1);

      setProductClinicDetail((val) => {
        return { ...val, quantities: setNewData };
      });
      return setNewData;
    });
  };

  return (
    <>
      <Grid container spacing={2} justifyContent="center">
        {erorQuantity.isError && (
          <Grid item xs={12} sm={10}>
            <div style={{ color: 'red', fontWeight: 'bold' }}>{`*${renderErrorContent()}`}</div>
          </Grid>
        )}

        <Grid item xs={12} sm={10}>
          {quantityList.map((dt, i) => (
            <Grid container spacing={4} key={i}>
              <Grid item xs={12} sm={4}>
                <Stack spacing={1} style={{ marginTop: '5px' }}>
                  <InputLabel htmlFor="from">
                    <FormattedMessage id="from" />
                  </InputLabel>
                  <TextField
                    fullWidth
                    type="number"
                    id={`from${i}`}
                    name={`from${i}`}
                    value={dt.fromQty}
                    onChange={(event) => onFromQty(event, i)}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Stack spacing={1} style={{ marginTop: '5px' }}>
                  <InputLabel>
                    <FormattedMessage id="to" />
                  </InputLabel>
                  <TextField
                    fullWidth
                    type="number"
                    id={`to${i}`}
                    name={`to${i}`}
                    value={dt.toQty}
                    onChange={(event) => onToQty(event, i)}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} sm={3}>
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
                <IconButton size="large" color="error" onClick={() => onDeleteQty(i)}>
                  <DeleteFilled />
                </IconButton>
              </Grid>
            </Grid>
          ))}

          <Button variant="contained" onClick={onAddQty} startIcon={<PlusOutlined />} style={{ marginTop: '20px' }}>
            Add
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default PricingQuantity;
