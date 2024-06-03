export default class UniversityStore {
    constructor() {
        this._universities = []
        this._universitiesByCity = []
        this._selectedUniversityId = {}
        this._selectedUniversityName = {}
    }

    setUniversities(universities) {
        this._universities = universities
    }
    setSelectedUniversityId(universityId) {
        this._selectedUniversityId = universityId
    }

    setSelectedUniversityName(universityName) {
        this._selectedUniversityName = universityName
    }

    setFilteredUniversities(university_id) {
        this._universitiesByCity = this._universities.filter(dir => dir.city_id === university_id)
    }

    get universities() {
        return this._universities
    }
    get selectedUniversityId() {
        return this._selectedUniversityId
    }

    get selectedUniversityName() {
        return this._selectedUniversityName
    }

    get filteredUniversities() {
        return this._universitiesByCity
    }
}