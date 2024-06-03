import {fireEvent, render, screen} from "@testing-library/react";
import {LabelWithInput} from "../src/shared/ui/InputWithLabel";

test('LabelWithInput contains expected placeholder', () => {
    const label = "Test";
    const expectedPlaceholder = "Test2"
    render(<LabelWithInput label={label} placeholder={expectedPlaceholder} onChange={() => {}} />)
    expect(screen.getByLabelText(label).placeholder).toBe(expectedPlaceholder)
})

test('LabelWithInput call onChange when input', () => {
    const label = "Test";
    const placeholder = "Test2"
    let isCalled = false;
    const onChange = () => isCalled = true;

    render(<LabelWithInput label={label} placeholder={placeholder} onChange={() => onChange()} />)
    const input = screen.getByLabelText(label)
    fireEvent.change(input, { target: { value: '123' } })
    expect(isCalled.toBe(true))
})