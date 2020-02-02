import React from 'react';

import NotFound from '@frontend-core/components/NotFound';
import { withView } from '@frontend-core/decorators';

const PageNotFound = () => <NotFound />;

const PageNotFoundView = withView()(PageNotFound);

export default PageNotFoundView;
