import axios from "axios";
import axiosInstance from "../../utils/AxiosInstance";
import { getPeriodsSuccess } from "./Actions";

export const getPeriods = async () => {
        const response = await axiosInstance.get("/periods");
        return response;
};

export const getEvents = async () => {
        const response = await axiosInstance.get("/events");
        return response;
};

export const postEvent = async (event) => {
        const response = await axiosInstance.post("/events",event);
        debugger

        return response;
};

