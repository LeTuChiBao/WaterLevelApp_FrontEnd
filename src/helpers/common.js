import moment from "moment";

export const formatDateTime = (dateTime)=> {
    return moment(dateTime).format('DD/MM/YYYY h:mm:ss A')
}