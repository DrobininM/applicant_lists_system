export default class StudyDirectionStore {
    constructor() {
        this._studyDirections = []
        this._studyDirectionsByUniversity = []
        this._selectedStudyDirectionId = {}
        this._selectedStudyDirectionName = {}
    }

    setDirections(universities) {
        this._studyDirections = universities
    }

    setFilteredStudyDirections(university_id) {
        this._studyDirectionsByUniversity = this._studyDirections.filter(dir => dir.university_id === university_id)
    }

    setSelectedDirectionId(directionId) {
        this._selectedStudyDirectionId = directionId
    }

    setSelectedDirectionName(directionName) {
        this._selectedStudyDirectionName = directionName
    }

    get allDirections() {
        return this._studyDirections
    }

    get filteredStudyDirections () {
        return this._studyDirectionsByUniversity;
    }

    get selectedDirectionId() {
        return this._selectedStudyDirectionId;
    }

    get selectedDirectionName() {
        return this._selectedStudyDirectionName;
    }
}