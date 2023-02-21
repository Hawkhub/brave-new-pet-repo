import React, { useEffect } from 'react';
import { bindActionCreators } from '@reduxjs/toolkit';
import { connect, ConnectedProps } from 'react-redux';

import { getExampleFirstField, getHeavyComputingSelector } from '_examples/entities/exampleEntity/selectors';
import { getExampleThunk } from '_examples/entities/exampleEntity/thunks';
import { ExampleRootState } from '_examples/entities/exampleEntity/types';

import styles from './ExampleSmartComponent.sass';

const mapStateToProps = (state: ExampleRootState) => ({
    firstField: getExampleFirstField(state),
    heavyComputingField: getHeavyComputingSelector(state),
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            getExampleThunk,
        },
        dispatch
    );

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type OwnProps = {
    someOwnProp: string;
};

const ExampleSmartComponent = (props: PropsFromRedux & OwnProps) => {
    const { someOwnProp, firstField, heavyComputingField, getExampleThunk } = props;

    useEffect(() => {
        getExampleThunk(someOwnProp);
    }, []);

    return (
        <div className={styles.wrapper}>
            {firstField}
            {heavyComputingField}
        </div>
    );
};

export default connector(ExampleSmartComponent);
