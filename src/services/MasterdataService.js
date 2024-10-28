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
  getCarList(search) {
    return instanceApi(true)
      .get(`/getCarlist?dbname=${localStorage.dbname}&provider=${localStorage.provider}&search=${search}`)
      .then((res) => res.data);
  },
  getCarReserveList(search) {
    return instanceApi(true)
      .get(`/getCarReserveList?dbname=${localStorage.dbname}&provider=${localStorage.provider}&search=${search}`)
      .then((res) => res.data);
  },
  getCustomer() {
    return instanceApi(true)
      .get(`/getCustomer?dbname=${localStorage.dbname}&provider=${localStorage.provider}`)
      .then((res) => res.data);
  },
  getUnit() {
    return instanceApi(true)
      .get(`/getUnit?dbname=${localStorage.dbname}&provider=${localStorage.provider}`)
      .then((res) => res.data);
  },
  getCompany() {
    return instanceApi(true)
      .get(`/getCompany?dbname=${localStorage.dbname}&provider=${localStorage.provider}`)
      .then((res) => res.data);
  },
  getSupplier() {
    return instanceApi(true)
      .get(`/getSupplier?dbname=${localStorage.dbname}&provider=${localStorage.provider}`)
      .then((res) => res.data);
  },
  getIncomeList() {
    return instanceApi(true)
      .get(`/getIncomeList?dbname=${localStorage.dbname}&provider=${localStorage.provider}`)
      .then((res) => res.data);
  },
  getExpensedList() {
    return instanceApi(true)
      .get(`/getExpensedList?dbname=${localStorage.dbname}&provider=${localStorage.provider}`)
      .then((res) => res.data);
  },
  getFuelList() {
    return instanceApi(true)
      .get(`/getFuelList?dbname=${localStorage.dbname}&provider=${localStorage.provider}`)
      .then((res) => res.data);
  },
  getEmployee() {
    return instanceApi(true)
      .get(`/getEmployee?dbname=${localStorage.dbname}&provider=${localStorage.provider}`)
      .then((res) => res.data);
  },
  getCustomer() {
    return instanceApi(true)
      .get(`/getCustomer?dbname=${localStorage.dbname}&provider=${localStorage.provider}`)
      .then((res) => res.data);
  },
  getDestination() {
    return instanceApi(true)
      .get(`/getDestination?dbname=${localStorage.dbname}&provider=${localStorage.provider}`)
      .then((res) => res.data);
  },
  getRouteList(search) {
    return instanceApi(true)
      .get(`/getRouteList?dbname=${localStorage.dbname}&provider=${localStorage.provider}&search=${search}`)
      .then((res) => res.data);
  },
  getDocPurList(search, from_date, to_date) {
    return instanceApi(true)
      .get(`/getDocPurList?dbname=${localStorage.dbname}&provider=${localStorage.provider}&search=${search}&fromdate=${from_date}&todate=${to_date}`)
      .then((res) => res.data);
  },
  getTSDocDetail(docno) {
    return instanceApi(true)
      .get(`/getTSDocDetail?dbname=${localStorage.dbname}&provider=${localStorage.provider}&doc_no=${docno}`)
      .then((res) => res.data);
  },

  deleteTSDoc(docno) {
    return instanceApi(true)
      .get(`/deleteTSDoc?dbname=${localStorage.dbname}&provider=${localStorage.provider}&docno=${docno}`)
      .then((res) => res.data);
  },
  getDocList(search, from_date, to_date) {
    return instanceApi(true)
      .get(`/getDocList?dbname=${localStorage.dbname}&provider=${localStorage.provider}&search=${search}&fromdate=${from_date}&todate=${to_date}`)
      .then((res) => res.data);
  },
  getTsDocApproveList(search, from_date, to_date) {
    return instanceApi(true)
      .get(`/getTsDocApproveList?dbname=${localStorage.dbname}&provider=${localStorage.provider}&search=${search}&fromdate=${from_date}&todate=${to_date}`)
      .then((res) => res.data);
  },
  getTsDocReportList(search, from_date, to_date) {
    return instanceApi(true)
      .get(`/getTsDocReportList?dbname=${localStorage.dbname}&provider=${localStorage.provider}&search=${search}&fromdate=${from_date}&todate=${to_date}`)
      .then((res) => res.data);
  },
  getTsDocHistoryList(search, from_date, to_date, status) {
    return instanceApi(true)
      .get(`/getTsDocHistoryList?dbname=${localStorage.dbname}&provider=${localStorage.provider}&search=${search}&fromdate=${from_date}&todate=${to_date}&status=${status}`)
      .then((res) => res.data);
  },
  getReserveCarlist(search, from_date, to_date, status) {
    return instanceApi(true)
      .get(`/getReserveCarlist?dbname=${localStorage.dbname}&provider=${localStorage.provider}&search=${search}&fromdate=${from_date}&todate=${to_date}&status=${status}`)
      .then((res) => res.data);
  },
  getReserveCarHistorylist(search, from_date, to_date, status) {
    return instanceApi(true)
      .get(`/getReserveCarHistorylist?dbname=${localStorage.dbname}&provider=${localStorage.provider}&search=${search}&fromdate=${from_date}&todate=${to_date}&status=${status}`)
      .then((res) => res.data);
  },
  getReserveCarApprovelist(search, from_date, to_date) {
    return instanceApi(true)
      .get(`/getReserveCarApprovelist?dbname=${localStorage.dbname}&provider=${localStorage.provider}&search=${search}&fromdate=${from_date}&todate=${to_date}`)
      .then((res) => res.data);
  },
  getErpUserPermissionLogin(search) {
    return instanceApi(true)
      .get(`/getErpUserPermissionLogin?dbname=${localStorage.dbname}&provider=${localStorage.provider}&search=${search}`)
      .then((res) => res.data);
  },
  getErpUserPermission(search) {
    return instanceApi(true)
      .get(`/getErpUserPermission?dbname=${localStorage.dbname}&provider=${localStorage.provider}&search=${search}`)
      .then((res) => res.data);
  },
  upDatePermission(data, user) {
    return instanceApi(true)
      .post(
        `/upDatePermission?dbname=${localStorage.dbname}&provider=${localStorage.provider}&user=${user}&doc_list=${data.doc_list}&doc_approve_list=${data.doc_approve_list}&doc_history_list=${data.doc_history_list}&doc_report_list=${data.doc_report_list}&doc_car_list=${data.doc_car_list}&doc_route_list=${data.doc_route_list}&doc_reserve_list=${data.doc_reserve_list}&doc_reserve_approve_list=${data.doc_reserve_approve_list}&doc_reserve_history_list=${data.doc_reserve_history_list}`
      )
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

  approveTSDoc(docno) {
    return instanceApi(true)
      .get(`/approveTSDoc?dbname=${localStorage.dbname}&provider=${localStorage.provider}&docno=${docno}`)
      .then((res) => res.data);
  },

  successTSDoc(docno, usercode) {
    return instanceApi(true)
      .get(`/successTSDoc?dbname=${localStorage.dbname}&provider=${localStorage.provider}&docno=${docno}&usercode=${usercode}`)
      .then((res) => res.data);
  },

  unapproveTSDoc(docno) {
    return instanceApi(true)
      .get(`/unapproveTSDoc?dbname=${localStorage.dbname}&provider=${localStorage.provider}&docno=${docno}`)
      .then((res) => res.data);
  },


  updateTransportData(postData) {
    return instanceApi(true)
      .post(`/updateTSDoc?dbname=${localStorage.dbname}&provider=${localStorage.provider}`, postData)
      .then((res) => res.data);
  },
  saveTransportData(postData) {
    return instanceApi(true)
      .post(`/createTSDoc?dbname=${localStorage.dbname}&provider=${localStorage.provider}`, postData)
      .then((res) => res.data);
  },
  updateCar(roworder, code, brand, province, car_type, car_type_2, register_date, driver, weight) {
    return instanceApi(true)
      .get(`/updateCar?dbname=${localStorage.dbname}&provider=${localStorage.provider}&roworder=${roworder}&code=${code}&province=${province}&brand=${brand}&car_type=${car_type}&register_date=${register_date}&driver=${driver}&weight=${weight}&car_type_2=${car_type_2}`)
      .then((res) => res.data);
  },

  updateReserveCar(roworder, doc_date, doc_no, creator_code, car_pack_type, request_receive_date, request_arrival_date, pickup_place, dropoff_place, remark) {
    return instanceApi(true)
      .get(`/updateReserveCar?dbname=${localStorage.dbname}&provider=${localStorage.provider}&roworder=${roworder}&docno=${doc_no}&docdate=${doc_date}&creatorcode=${creator_code}&carpacktype=${car_pack_type}&requestreceivedate=${request_receive_date}&requestarrivaldate=${request_arrival_date}&pickupplace=${pickup_place}&dropoffplace=${dropoff_place}&remark=${remark}`)
      .then((res) => res.data);
  },
  updateReceiveStatus(doc_no, car_code, status_selected, receive_remark, driver_code, weight,usercode ,old_car) {
    return instanceApi(true)
      .get(`/updateReceiveStatus?dbname=${localStorage.dbname}&provider=${localStorage.provider}&docno=${doc_no}&car_code=${car_code}&status_selected=${status_selected}&receive_remark=${receive_remark}&driver_code=${driver_code}&weight=${weight}&usercode=${usercode}&old_car=${old_car}`)
      .then((res) => res.data);
  },
  
  sendApproveReserveDoc(docno) {
    return instanceApi(true)
      .get(`/approveReserveDoc?dbname=${localStorage.dbname}&provider=${localStorage.provider}&docno=${docno}`)
      .then((res) => res.data);
  },

  sendSuccessReserveDoc(doc_no,arrival_date,send_remark,usercode) {
    return instanceApi(true)
      .get(`/sendSuccessReserveDoc?dbname=${localStorage.dbname}&provider=${localStorage.provider}&doc_no=${doc_no}&arrival_date=${arrival_date}&send_remark=${send_remark}&usercode=${usercode}`)
      .then((res) => res.data);
  },
  updateRoute(roworder, code, from_place, to_place) {
    return instanceApi(true)
      .get(`/updateRoute?dbname=${localStorage.dbname}&provider=${localStorage.provider}&roworder=${roworder}&code=${code}&to_place=${to_place}&from_place=${from_place}`)
      .then((res) => res.data);
  },

  deleteCar(roworder) {
    return instanceApi(true)
      .get(`/deleteCar?dbname=${localStorage.dbname}&provider=${localStorage.provider}&roworder=${roworder}`)
      .then((res) => res.data);
  },
  deleteReserveDoc(doc_no) {
    return instanceApi(true)
      .get(`/deleteReserveDoc?dbname=${localStorage.dbname}&provider=${localStorage.provider}&roworder=${roworder}`)
      .then((res) => res.data);
  },
  successSendReserveDoc(doc_no,user_code) {
    return instanceApi(true)
      .get(`/successSendReserveDoc?dbname=${localStorage.dbname}&provider=${localStorage.provider}&doc_no=${doc_no}&user_code=${user_code}`)
      .then((res) => res.data);
  },
  cancelReserveDoc(doc_no,car_code,remark,user) {
    return instanceApi(true)
      .get(`/cancelReserveDoc?dbname=${localStorage.dbname}&provider=${localStorage.provider}&doc_no=${doc_no}&car_code=${car_code}&remark=${remark}&user=${user}`)
      .then((res) => res.data);
  },
  deleteRoute(roworder) {
    return instanceApi(true)
      .get(`/deleteRoute?dbname=${localStorage.dbname}&provider=${localStorage.provider}&roworder=${roworder}`)
      .then((res) => res.data);
  },
  createCar(postData) {
    return instanceApi(true)
      .post(`/createCar?dbname=${localStorage.dbname}&provider=${localStorage.provider}`, postData)
      .then((res) => res.data);
  },

  createReserveCar(postData) {
    return instanceApi(true)
      .post(`/createReserveCar?dbname=${localStorage.dbname}&provider=${localStorage.provider}`, postData)
      .then((res) => res.data);
  },
  createRoute(postData) {
    return instanceApi(true)
      .post(`/createRoute?dbname=${localStorage.dbname}&provider=${localStorage.provider}`, postData)
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
  getDocNMHistory(search, from_date, to_date, sale_type, trans_type, price_type, groupmain, groupsub, itembrand, itemmodel, itempattern, itemcategory, itemdesign) {
    return instanceApi(true)
      .get(`/getDocNMHistory?dbname=${localStorage.dbname}&provider=${localStorage.provider}&search=${search}&fromdate=${from_date}&todate=${to_date}&saletype=${sale_type}&transtype=${trans_type}&pricetype=${price_type}&groupmain=${groupmain}&groupsub=${groupsub}&itembrand=${itembrand}&itemmodel=${itemmodel}&itempattern=${itempattern}&itemcategory=${itemcategory}&itemdesign=${itemdesign}`)
      .then((res) => res.data);
  },
  getDocStdHistory(search, from_date, to_date, sale_type, trans_type, price_type, groupmain, groupsub, itembrand, itemmodel, itempattern, itemcategory, itemdesign) {
    return instanceApi(true)
      .get(`/getDocStdHistory?dbname=${localStorage.dbname}&provider=${localStorage.provider}&search=${search}&fromdate=${from_date}&todate=${to_date}&saletype=${sale_type}&transtype=${trans_type}&pricetype=${price_type}&groupmain=${groupmain}&groupsub=${groupsub}&itembrand=${itembrand}&itemmodel=${itemmodel}&itempattern=${itempattern}&itemcategory=${itemcategory}&itemdesign=${itemdesign}`)
      .then((res) => res.data);
  },
  getDocPurHistory(search, from_date, to_date, sale_type, trans_type, price_type, groupmain, groupsub, itembrand, itemmodel, itempattern, itemcategory, itemdesign) {
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

  getItemPriceDashboardList(search, saletype, transporttype, pricetype, groupmain, itembrand, groupsub, itempattern, itemmodel, itemcategory, itemdesign, nosentprice) {
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
