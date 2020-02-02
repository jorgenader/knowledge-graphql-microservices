import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Nav, Navbar, NavbarBrand, NavItem, NavLink } from 'reactstrap';
import { resolvePath as urlResolve } from 'tg-named-routes';

import { useAuth } from '@frontend-core/hooks';
import { SETTINGS } from '@frontend-app/settings';

const NavigationBar = () => {
    const { user } = useAuth();
    const { t } = useTranslation();

    let authNav = (
        <Nav className="ml-auto" navbar>
            <NavItem>
                <NavLink tag={Link} to={urlResolve('auth:signup')}>
                    {t('auth:signup.linkName')}
                </NavLink>
            </NavItem>
            <NavItem>
                <NavLink tag={Link} to={urlResolve('auth:login')}>
                    {t('auth:login.linkName')}
                </NavLink>
            </NavItem>
        </Nav>
    );

    if (user) {
        authNav = (
            <Nav className="ml-auto" navbar>
                <NavItem>
                    <NavLink href="#">{user.email}</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag={Link} to={urlResolve('auth:logout')}>
                        {t('auth:logout.linkName')}
                    </NavLink>
                </NavItem>
            </Nav>
        );
    }

    let devUrls = null;
    if (process.env.NODE_ENV !== 'production') {
        devUrls = (
            <NavItem>
                <NavLink
                    href={SETTINGS.SITE_URL + SETTINGS.DJANGO_ADMIN_PANEL}
                    target="_blank"
                >
                    {t('common:adminPanel.linkName')}
                </NavLink>
            </NavItem>
        );
    }

    return (
        <Navbar color="faded" light expand="md">
            <NavbarBrand tag={Link} to={urlResolve('landing')}>
                {t('common:links.brand')}
            </NavbarBrand>
            <Nav navbar>{devUrls}</Nav>
            {authNav}
        </Navbar>
    );
};

export default NavigationBar;
