/**
 * Composable untuk handle form state dan validation
 */

import { ref, reactive, computed } from 'vue'

export interface FormErrors {
  [key: string]: string | string[]
}

export interface UseFormOptions<T> {
  initialValues: T
  onSubmit?: (values: T) => Promise<void> | void
}

export function useForm<T extends Record<string, any>>(options: UseFormOptions<T>) {
  const { initialValues, onSubmit } = options

  const values = reactive<T>({ ...initialValues })
  const errors = ref<FormErrors>({})
  const touched = ref<Record<keyof T, boolean>>({} as Record<keyof T, boolean>)
  const isSubmitting = ref(false)
  const isValidating = ref(false)

  /**
   * Set field value
   */
  const setFieldValue = (field: keyof T, value: any) => {
    values[field] = value
  }

  /**
   * Set field error
   */
  const setFieldError = (field: keyof T, error: string | string[]) => {
    errors.value[field as string] = error
  }

  /**
   * Clear field error
   */
  const clearFieldError = (field: keyof T) => {
    delete errors.value[field as string]
  }

  /**
   * Mark field as touched
   */
  const setFieldTouched = (field: keyof T, isTouched: boolean = true) => {
    touched.value[field] = isTouched
  }

  /**
   * Get field error
   */
  const getFieldError = (field: keyof T) => {
    return errors.value[field as string]
  }

  /**
   * Check if field has error
   */
  const hasFieldError = (field: keyof T) => {
    return !!(errors.value[field as string] && touched.value[field])
  }

  /**
   * Check if form is valid
   */
  const isValid = computed(() => {
    return Object.keys(errors.value).length === 0
  })

  /**
   * Check if form has any errors
   */
  const hasErrors = computed(() => {
    return Object.keys(errors.value).length > 0
  })

  /**
   * Reset form to initial values
   */
  const resetForm = () => {
    Object.assign(values, initialValues)
    errors.value = {}
    touched.value = {} as Record<keyof T, boolean>
  }

  /**
   * Handle form submit
   */
  const handleSubmit = async (e?: Event) => {
    if (e) {
      e.preventDefault()
    }

    if (isSubmitting.value) return

    isSubmitting.value = true
    try {
      if (onSubmit) {
        await onSubmit(values)
      }
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValidating,
    isValid,
    hasErrors,
    setFieldValue,
    setFieldError,
    clearFieldError,
    setFieldTouched,
    getFieldError,
    hasFieldError,
    resetForm,
    handleSubmit
  }
}
