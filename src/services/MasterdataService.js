import { instanceApi } from "@/services/ProviderService";
import axios from "axios";
export default {
  getDocNMList(search, from_date, to_date) {
    return instanceApi(true)
      .get(`/getDocNMList?dbname=${localStorage.dbname}&provider=${localStorage.provider}&search=${search}&fromdate=${from_date}&todate=${to_date}`)
      .then((res) => res.data);
  },
  getDocStdList(search, from_date, to_date) {
    return instanceApi(true)
      .get(`/getDocStdList?dbname=${localStorage.dbname}&provider=${localStorage.provider}&search=${search}&fromdate=${from_date}&todate=${to_date}`)
      .then((res) => res.data);
  },
  getDocPurList(search, from_date, to_date) {
    return instanceApi(true)
      .get(`/getDocPurList?dbname=${localStorage.dbname}&provider=${localStorage.provider}&search=${search}&fromdate=${from_date}&todate=${to_date}`)
      .then((res) => res.data);
  },
  createImportDocNM(postData) {
    return instanceApi(true)
      .post(`/createImportDocNM?dbname=${localStorage.dbname}&provider=${localStorage.provider}`, postData)
      .then((res) => res.data);
  },
  createImportDocStd(postData) {
    return instanceApi(true)
      .post(`/createImportDocStd?dbname=${localStorage.dbname}&provider=${localStorage.provider}`, postData)
      .then((res) => res.data);
  },

  saveItemPriceNM(postData) {
    return instanceApi(true)
      .post(`/saveItemPriceNM?dbname=${localStorage.dbname}&provider=${localStorage.provider}`, postData)
      .then((res) => res.data);
  },
  
  saveItemPriceSTD(postData) {
    return instanceApi(true)
      .post(`/saveItemPriceSTD?dbname=${localStorage.dbname}&provider=${localStorage.provider}`, postData)
      .then((res) => res.data);
  },
  saveItemPurPrice(postData) {
    return instanceApi(true)
      .post(`/saveItemPurPrice?dbname=${localStorage.dbname}&provider=${localStorage.provider}`, postData)
      .then((res) => res.data);
  },
  
  createImportDocPur(postData) {
    return instanceApi(true)
      .post(`/createImportDocPur?dbname=${localStorage.dbname}&provider=${localStorage.provider}`, postData)
      .then((res) => res.data);
  },

  getDocDetailNM(docno) {
    return instanceApi(true)
      .get(`/getDocDetailNM?dbname=${localStorage.dbname}&provider=${localStorage.provider}&docno=${docno}`)
      .then((res) => res.data);
  },
  getDocDetailStd(docno) {
    return instanceApi(true)
      .get(`/getDocDetailStd?dbname=${localStorage.dbname}&provider=${localStorage.provider}&docno=${docno}`)
      .then((res) => res.data);
  },
  getDocDetailPur(docno) {
    return instanceApi(true)
      .get(`/getDocDetailPur?dbname=${localStorage.dbname}&provider=${localStorage.provider}&docno=${docno}`)
      .then((res) => res.data);
  },
  getDocNMHistory(search, from_date, to_date,sale_type,trans_type,price_type,groupmain,groupsub,itembrand,itemmodel,itempattern,itemcategory,itemdesign) {
    return instanceApi(true)
      .get(`/getDocNMHistory?dbname=${localStorage.dbname}&provider=${localStorage.provider}&search=${search}&fromdate=${from_date}&todate=${to_date}&saletype=${sale_type}&transtype=${trans_type}&pricetype=${price_type}&groupmain=${groupmain}&groupsub=${groupsub}&itembrand=${itembrand}&itemmodel=${itemmodel}&itempattern=${itempattern}&itemcategory=${itemcategory}&itemdesign=${itemdesign}`)
      .then((res) => res.data);
  },
  getDocStdHistory(search, from_date, to_date,sale_type,trans_type,price_type,groupmain,groupsub,itembrand,itemmodel,itempattern,itemcategory,itemdesign) {
    return instanceApi(true)
      .get(`/getDocStdHistory?dbname=${localStorage.dbname}&provider=${localStorage.provider}&search=${search}&fromdate=${from_date}&todate=${to_date}&saletype=${sale_type}&transtype=${trans_type}&pricetype=${price_type}&groupmain=${groupmain}&groupsub=${groupsub}&itembrand=${itembrand}&itemmodel=${itemmodel}&itempattern=${itempattern}&itemcategory=${itemcategory}&itemdesign=${itemdesign}`)
      .then((res) => res.data);
  },
  getDocPurHistory(search, from_date, to_date,sale_type,trans_type,price_type,groupmain,groupsub,itembrand,itemmodel,itempattern,itemcategory,itemdesign) {
    return instanceApi(true)
      .get(`/getDocPurHistory?dbname=${localStorage.dbname}&provider=${localStorage.provider}&search=${search}&fromdate=${from_date}&todate=${to_date}&saletype=${sale_type}&transtype=${trans_type}&pricetype=${price_type}&groupmain=${groupmain}&groupsub=${groupsub}&itembrand=${itembrand}&itemmodel=${itemmodel}&itempattern=${itempattern}&itemcategory=${itemcategory}&itemdesign=${itemdesign}`)
      .then((res) => res.data);
  },

  reactiveDocNM(postData) {
    return instanceApi(true)
      .post(`/reactiveDocNM?dbname=${localStorage.dbname}&provider=${localStorage.provider}`, postData)
      .then((res) => res.data);
  },
  reactiveDocStd(postData) {
    return instanceApi(true)
      .post(`/reactiveDocStd?dbname=${localStorage.dbname}&provider=${localStorage.provider}`, postData)
      .then((res) => res.data);
  },
  reactiveDocPur(postData) {
    return instanceApi(true)
      .post(`/reactiveDocPur?dbname=${localStorage.dbname}&provider=${localStorage.provider}`, postData)
      .then((res) => res.data);
  },
  getItemPriceNMList(search, saletype, transporttype, pricetype, groupmain, itembrand, groupsub, itempattern, itemmodel, itemcategory, itemdesign) {
    return instanceApi(true)
      .get(`/getItemPriceNMList?dbname=${localStorage.dbname}&provider=${localStorage.provider}&search=${search}&saletype=${saletype}&transporttype=${transporttype}&pricetype=${pricetype}&groupmain=${groupmain}&itembrand=${itembrand}&groupsub=${groupsub}&itempattern=${itempattern}&itemmodel=${itemmodel}&itemcategory=${itemcategory}&itemdesign=${itemdesign}`)
      .then((res) => res.data);
  },
  getItemPriceStdList(search, saletype, transporttype, pricetype, groupmain, itembrand, groupsub, itempattern, itemmodel, itemcategory, itemdesign) {
    return instanceApi(true)
      .get(`/getItemPriceStdList?dbname=${localStorage.dbname}&provider=${localStorage.provider}&search=${search}&saletype=${saletype}&transporttype=${transporttype}&pricetype=${pricetype}&groupmain=${groupmain}&itembrand=${itembrand}&groupsub=${groupsub}&itempattern=${itempattern}&itemmodel=${itemmodel}&itemcategory=${itemcategory}&itemdesign=${itemdesign}`)
      .then((res) => res.data);
  },

  getItemPriceDashboardList(search, saletype, transporttype, pricetype, groupmain, itembrand, groupsub, itempattern, itemmodel, itemcategory, itemdesign,nosentprice) {
    return instanceApi(true)
      .get(`/getItemPriceDashboardList?dbname=${localStorage.dbname}&provider=${localStorage.provider}&search=${search}&saletype=${saletype}&transporttype=${transporttype}&pricetype=${pricetype}&groupmain=${groupmain}&itembrand=${itembrand}&groupsub=${groupsub}&itempattern=${itempattern}&itemmodel=${itemmodel}&itemcategory=${itemcategory}&itemdesign=${itemdesign}&nosentprice=${nosentprice}`)
      .then((res) => res.data);
  },

  getItemPricePurList(search, saletype, transporttype, pricetype, itembrand, itempattern, itemmodel, itemcategory, itemdesign) {
    return instanceApi(true)
      .get(`/getItemPricePurList?dbname=${localStorage.dbname}&provider=${localStorage.provider}&search=${search}&saletype=${saletype}&transporttype=${transporttype}&pricetype=${pricetype}&itembrand=${itembrand}&itempattern=${itempattern}&itemmodel=${itemmodel}&itemcategory=${itemcategory}&itemdesign=${itemdesign}`)
      .then((res) => res.data);
  },
  getMasterDataFilter() {
    return instanceApi(true)
      .get(`/getMasterDataFilter?dbname=${localStorage.dbname}&provider=${localStorage.provider}`)
      .then((res) => res.data);
  },
  getDashBoardDetail(ic_code) {
    return instanceApi(true)
      .get(`/getDashBoardDetail?dbname=${localStorage.dbname}&provider=${localStorage.provider}&ic_code=${ic_code}`)
      .then((res) => res.data);
  }


};
