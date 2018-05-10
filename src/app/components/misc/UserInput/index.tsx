import * as React from "react";
import Icon, { GLYPHS } from "components/misc/Icon";
import "./userinput.scss";

interface IResultProps {
    label: string;
    type: string;
    name: string;
    placeholder?: string;
    value?: string;
    onChange?: any;
}

export default function UserInput(props: IResultProps) {
    return (
        <div className="user-input">
            <label htmlFor={props.name}>{props.label}</label>
            <input type={props.type} 
                value={props.value}
                name={props.name} placeholder={props.placeholder}
                onChange={(e) => {
                    props.onChange(e.target.value);
                }} />
        </div>
    );
}
