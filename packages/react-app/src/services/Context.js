import React from 'react';

export const AppContext = React.createContext({
  viewer: null,
});

export function withAppContext(Component) {
  return function ComponentWithAppContext(props) {
    return (
      <AppContext.Consumer>
        {appContext => <Component {...props} {...appContext} />}
      </AppContext.Consumer>
    );
  };
}
