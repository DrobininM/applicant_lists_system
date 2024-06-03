export default class CityStore {
    constructor() {
        this._cities = []
        this._selectedCityId = {}
        this._selectedCityName = {}
    }

    setCities(universities) {
        this._cities = universities
    }
    setSelectedCityId(universityId) {
        this._selectedCityId = universityId
    }

    setSelectedCityName(universityName) {
        this._selectedCityName = universityName
    }

    get cities() {
        return this._cities
    }
    get selectedCityId() {
        return this._selectedCityId
    }

    get selectedCityName() {
        return this._selectedCityName
    }
}