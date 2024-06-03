export default class StudyModeStore {
    constructor() {
        this._studyModes = []
        this._filteredStudyModes = []
        this._selectedStudyModeId = {}
    }

    setStudyModes(studyModes) {
        this._studyModes = studyModes
    }

    setFilteredStudyModes(universityId, directionId, programId) {
        this._filteredStudyModes = this._studyModes.filter(studyMode => studyMode.university_id === universityId
            && studyMode.direction_id === directionId
            && studyMode.program_id === programId)
    }

    setSelectedStudyModeId(studyModeId) {
        this._selectedStudyModeId = studyModeId
    }

    get allStudyModes() {
        return this._studyModes
    }

    get filteredStudyModes() {
        return this._filteredStudyModes
    }

    get selectedStudyModeId() {
        return this._selectedStudyModeId
    }
}