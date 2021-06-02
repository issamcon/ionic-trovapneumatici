import { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'
import axios, { AxiosRequestConfig } from 'axios'
import firebase from 'firebase/app';
import 'firebase/auth';


const axiosRequestConfig: AxiosRequestConfig = {
    headers: { "Access-Control-Allow-Origin": "*" }
};
// define your typings for the store state
export enum AuthMode {
    SignIn,
    SignUp,
}

export interface Authentication {
    user: firebase.User | null;
    nominativo: string | null;
    photoURL: string | null;
    isAuth: boolean;
    errorMsg: string;
    mode: AuthMode;
    dbUserId: number | null;
    requestUpdateApp: boolean;
    routeAfterSignIn: string | null;
}

export interface SearchFilter {
    name: string;
    surname: string;
    cimiteroId: number;
    dataMorte: Date;
    dataNascita: Date;
}

export interface DefuntoItem {
    id: number;
    defuntoName: string;
    defuntoSurname: string;
    dataNascita: Date;
    dataMorte: Date;
    tipoManufatto: string;
    posizioneAttuale: Posizione;
}

export interface Posizione {
    cimiteroId: number;
    cimiteroNome: string;
    cimiteroComune: string;
    cimiteroAddress: string;
    cimiteroProvince: string;
    area1: string;
    area2: string;
    zona1: string;
    zona2: string;
    zona3: string;
    latitudine: number;
    longitudine: number;
    tipoPosizione: string;
}

export interface ResultItem {
    cimiteroNome: string;
    defunti: Array<DefuntoItem>;
}

export interface State {
    auth: Authentication | null;
    filter: SearchFilter | null;
    results: Array<ResultItem>;
    searchSuccess: boolean;
    searchResultsCount: number;
    searchResultMessage: string;
    current: DefuntoItem | null;
    mieiDefunti: Array<DefuntoItem>;
    cimiteri: Array<any>;
    currentLang: string;
    langs: Array<string>;
    lang: any;
    appSettings: AppSetting | null;

}

export interface Platform {
    os: string;
    appVerNumber: string;
    appVerCode: string;
}

export interface AppSetting {
    lastIosVerCode: string;
    lastIosVerNum: string;
    lastAndroidVerCode: string;
    lastAndroidVerNum: string;
    iosAppId: string;
    androidAppId: string;
    forceUpdete: boolean;
}


// define injection key
export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
    state: {
        auth: {
            user: null,
            nominativo: null,
            photoURL: null,
            isAuth: false,
            errorMsg: '',
            mode: AuthMode.SignIn,
            dbUserId: null,
            requestUpdateApp: false,
            routeAfterSignIn: null
        },
        cimiteri: [],
        filter: null,
        results: [],
        current: null,
        mieiDefunti: [],
        searchSuccess: false,
        searchResultsCount: 0,
        searchResultMessage: "",
        langs: ["it", "en"],
        currentLang: "it",
        lang: null,
        appSettings: null
    },

    getters: {
        allCimiteri(state) {
            return state.cimiteri;
        }
    },
    // ACTIONS (asynchronous)
    actions: {
        async setAuth({ commit }, payload: any): Promise<void> {
            try {
                commit("setAuth", payload.user);

                if (!payload.user.isAnonymous) {

                    const postData = {
                        Nominativo: payload.user.displayName,
                        Email: payload.user.email,
                        Tel: payload.user.phoneNumber,
                        PhotoUrl: payload.user.photoURL,
                        ProviderRegistrazione: payload.user.providerData.length > 0 ? payload.user.providerData[0]?.providerId : payload.user.providerId,
                        FirebaseUid: payload.user.uid,
                        Platform: payload.platform.os,
                        AppVerNumber: payload.platform.appVerNumber,
                        AppVerCode: payload.platform.appVerCode
                    };
                    console.log('Request:', postData);
                    const response = await axios.post(
                        "https://dev.aldilapp.it/api/appusers",
                        postData,
                        axiosRequestConfig
                    );
                    console.log('Response:', response);
                    if (response.status == 200 || response.status == 201) {
                        console.log('User da db:', response.data);
                        commit("setDbUser", response.data.user);
                        commit("setMieiDefunti", response.data.mieiDefunti);
                    }
                }
            }
            catch (ex) {
                console.log(ex);
                //commit("setFailAuth", ex.toString());
            }
        },
        setFailAuth({ commit }, payload: string) {
            commit("setFailAuth", payload);
        },
        setFilter({ commit }, payload: SearchFilter) {
            if (payload.dataNascita) {
                payload.dataNascita.setHours(0, 0, 0, 0);
            }
            if (payload.dataMorte) {
                payload.dataMorte.setHours(0, 0, 0, 0);
            }
            commit("setFilter", payload);
        },
        setResults({ commit }, payload: Array<ResultItem>) {
            commit("setResults", payload);
        },
        setCurrentItem({ commit }, payload: ResultItem) {
            commit("setCurrentItem", payload);
        },
        setRouteAfterSignIn({ commit }, payload: string) {
            commit("setRouteAfterSignIn", payload);
        },

        async fetchCimiteri({ commit }): Promise<void> {
            const response = await axios.get("https://dev.aldilapp.it/api/cimiteri", axiosRequestConfig);
            commit("setCimiteri", response.data);
        },

        async fetchMieiDefunti({ commit }): Promise<void> {
            if (this.state.auth && this.state.auth.dbUserId) {
                const dbUserId = this.state.auth.dbUserId;
                const response = await axios.get("https://dev.aldilapp.it/api/appusers/" + dbUserId + "/defunti", axiosRequestConfig);
                if (response.status == 200 || response.status == 201) {
                    console.log(response.data);
                    commit("setMieiDefunti", response.data.mieiDefunti);
                }
            }
        },

        async searchDefunti({ commit }, payload: SearchFilter): Promise<boolean> {
            commit("setFilter", payload);
            try {
                const response = await axios.post(
                    "https://dev.aldilapp.it/api/defunti/filter",
                    payload,
                    axiosRequestConfig
                );
                if (response.status == 200) {
                    commit("setResults", response.data);
                    return true;
                }
                else {
                    commit("setSearchError", "Fallita APi filter " + response.statusText);
                    return false;
                }
            }
            catch (ex) {
                commit("setSearchError", "Fallita APi filter " + ex);
                return false;
            }
        },

        async selectDetail({ commit }, payload: number): Promise<boolean> {
            try {
                const response = await axios.get(
                    "https://dev.aldilapp.it/api/defunti/" + payload, axiosRequestConfig
                );
                if (response.status == 200) {
                    commit("setCurrentItem", response.data);
                    return true;
                }
                else {
                    console.log("Defunto non trovato, ID: ", payload);
                    return false;
                }
            }
            catch (ex) {
                commit("setSearchError", "Fallita APi filter " + ex);
                return false;
            }
        },

        async addDefunto({ commit }): Promise<boolean> {
            try {

                const dbUserId = this.state.auth?.dbUserId;
                const data = {
                    defuntoId: this.state.current?.id
                };
                const response = await axios.post(
                    "https://dev.aldilapp.it/api/appusers/" + dbUserId + "/defunti",
                    data,
                    axiosRequestConfig
                );
                if (response.status == 200 || response.status == 201) {
                    console.log('Inserito defunto tra i miei defunti');
                    const response2 = await axios.get("https://dev.aldilapp.it/api/appusers/" + dbUserId + "/defunti", axiosRequestConfig);
                    if (response2.status == 200 || response2.status == 201) {
                        commit("setMieiDefunti", response2.data.mieiDefunti);
                    }
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (ex) {
                return false;
            }
        },

        async loadAppSettings({ commit }): Promise<void> {
            await axios.get(
                "https://dev.aldilapp.it/api/AppSettings",
                axiosRequestConfig
            ).then((resp) => {
                if (resp.status == 200 || resp.status == 201) {
                    commit("setAppSetting", resp.data);
                }
            }).catch((err) => {
                console.log(err);
            });
        },

        selectLang({ commit }, payload: string): void {
            commit("setLang", payload);
        },

        resetUser({ commit }): void {
            commit("resetUser");
        }
    },

    // MUTATIONS ( set the state )
    mutations: {
        setAuth(state: any, user: any) {
            state.auth.user = user;
            state.auth.isAuth = true;
            state.auth.errorMsg = "";
            state.auth.mode = AuthMode.SignIn;
        },
        setDbUser(state: any, appUser: any) {
            state.auth.dbUserId = appUser.id;
            state.auth.photoURL = appUser.photoUrl;
            state.auth.nominativo = appUser.nominativo;
        },
        setRequestUpdate(state: any, update: boolean) {
            state.auth.requestUpdateApp = update;
        },
        setFailAuth(state: any, error: string) {
            state.auth.user = null;
            state.auth.isAuth = false;
            state.auth.errorMsg = error;
            state.auth.dbUserId = null;
        },
        setFilter(state: any, filter: SearchFilter) {
            state.filter = filter;
        },
        setResults(state: any, results: Array<ResultItem>) {
            state.results = results;
            state.searchSuccess = true;
            state.searchResultsCount = results.reduce((sum, current) => sum + current.defunti.length, 0);
            state.searchResultMessage = "";
        },
        setSearchError(state: any, error: string) {
            state.results = [];
            state.searchSuccess = false;
            state.searchResultsCount = state.results.length;
            state.searchResultMessage = error;
        },
        setCurrentItem(state: any, current: ResultItem) {
            state.current = current;
        },

        setCimiteri(state: any, payload: Array<any>) {
            state.cimiteri = payload;
        },

        setMieiDefunti(state: any, payload: Array<any>) {
            state.mieiDefunti = payload;
        },

        setLang(state: any, payload: string) {
            state.currentLang = payload;
            if (payload === "it") {
                state.lang = require('/public/assets/lang/it.json');
            }
            else {
                state.lang = require('/public/assets/lang/en.json');
            }
        },

        resetUser(state: any) {
            state.auth = {
                user: null,
                isAuth: false,
                nominativo: null,
                photoURL: null,
                errorMsg: '',
                mode: AuthMode.SignIn,
                dbUserId: null,
                routeAfterSignIn: null
            };
            state.mieiDefunti = [];
        },

        setRouteAfterSignIn(state: any, payload: string) {
            state.auth.routeAfterSignIn = payload;
        },

        setAppSetting(state: any, payload: any) {
            state.appSettings = {
                lastIosVerCode: payload.lastVerCodeIos,
                lastIosVerNum: payload.lastVerNumIos,
                lastAndroidVerCode: payload.lastVerCodeAndroid,
                lastAndroidVerNum: payload.lastVerNumAndroid,
                iosAppId: payload.appleAppId,
                androidAppId: payload.androidAppId,
                forceUpdete: false,
            }
        }
    }
});
//
// @see https://github.com/vuejs/vuex/tree/v4.0.0-rc.1
//


