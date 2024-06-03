export default function validatePositiveNumbers(value) {
    if (value === '') {
        return true;
    }

    const parsed = parseInt(value, 10);

    return !(isNaN(value) || parsed < 0);
}