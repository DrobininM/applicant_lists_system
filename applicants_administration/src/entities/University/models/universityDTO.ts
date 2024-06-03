export class UniversityDTO {
    university_id: number;
    university_name: string;
    city_id: number;
    city_name: string;

    constructor(id: number, name: string, cityId: number, cityName: string) {
        this.university_id = id;
        this.university_name = name;
        this.city_id = cityId;
        this.city_name = cityName;
    }
}