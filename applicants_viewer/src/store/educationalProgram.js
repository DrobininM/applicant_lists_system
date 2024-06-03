export default class ProgramStore {
    constructor() {
        this._programs = []
        this._filteredPrograms = []
        this._selectedProgramId = {}
        this._selectedProgramName = {}
    }

    setPrograms(programs) {
        this._programs = programs
    }

    setFilteredPrograms(universityId, directionId) {
        this._filteredPrograms = this._programs.filter(program => program.university_id === universityId && program.direction_id === directionId)
    }

    setSelectedProgramId(programId) {
        this._selectedProgramId = programId
    }

    setSelectedProgramName(programName) {
        this._selectedProgramName = programName
    }

    get allPrograms() {
        return this._programs
    }

    get filteredPrograms () {
        return this._filteredPrograms
    }

    get selectedProgramId() {
        return this._selectedProgramId
    }

    get selectedProgramName() {
        return this._selectedProgramName
    }
}