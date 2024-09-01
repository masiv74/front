import { useState } from 'react';

export const useForm = ( initialForm = {} ) => {
  
    const [ formState, setFormState ] = useState( initialForm );

    const onInputChange = ({ target }) => {
        const { name, value } = target;
        setFormState({
            ...formState,
            [ name ]: value
        });
    }

    const onResetForm = () => {
        setFormState( initialForm );
    }

    const resetSpecificFields = (fieldsToReset = []) => {
        const updatedState = {};
        fieldsToReset.forEach(field => {
          if (initialForm.hasOwnProperty(field)) {
            updatedState[field] = initialForm[field];
          }
        });
        setFormState({
          ...formState,
          ...updatedState
        });
      };
    return {
        ...formState,
        formState,
        onInputChange,
        onResetForm,
        resetSpecificFields
    }
}