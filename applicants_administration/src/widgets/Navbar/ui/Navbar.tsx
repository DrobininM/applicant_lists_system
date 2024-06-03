import { texts } from "../consts/texts";
import backgroundStyles from '../../../shared/styles/colors.module.css'
import componentStyles from './styles.module.css'
import {FC, ReactNode} from "react";

interface INavBarProps {
    navbarTitle?: string;
    navbarDescription?: string;
    children?: ReactNode;
}


export const NavBar:FC<INavBarProps> = ({navbarTitle = texts.navbarTitle, navbarDescription = texts.navbarDescription, children = undefined}) => {
    return (
        <div className={`${backgroundStyles.blue_container} ${componentStyles.content_holder}`}>
            <div className={componentStyles.navbar_container}>
                <div className={componentStyles.brand_container}>
                    <span className={componentStyles.brand_style}>{navbarTitle}</span>
                    <span className={componentStyles.description_style}>{navbarDescription}</span>
                </div>

                {children}
            </div>
        </div>
    )
}