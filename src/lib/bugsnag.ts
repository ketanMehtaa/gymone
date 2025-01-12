import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';
import React from 'react';

if (!Bugsnag.isStarted()) {
  Bugsnag.start({
    apiKey: process.env.NEXT_PUBLIC_BUGSNAG_API_KEY || '',
    plugins: [new BugsnagPluginReact(React)],
    releaseStage: process.env.NODE_ENV,
    enabledReleaseStages: ['production', 'staging'],
  });
}

export const ErrorBoundary = Bugsnag.getPlugin('react')!.createErrorBoundary(React);
export default Bugsnag; 