import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Step {
  title: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

const Stepper = ({ steps, currentStep }: StepperProps) => {
  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <React.Fragment key={index}>
            <View style={styles.stepContainer}>
              <View
                style={[
                  styles.circle,
                  isActive && styles.activeCircle,
                  isCompleted && styles.completedCircle,
                ]}
              >
                <Text
                  style={[
                    styles.stepText,
                    isActive && styles.activeStepText,
                    isCompleted && styles.completedStepText,
                  ]}
                >
                  {stepNumber}
                </Text>
              </View>
              <Text
                style={[
                  styles.title,
                  isActive && styles.activeTitle,
                  isCompleted && styles.completedTitle,
                ]}
              >
                {step.title}
              </Text>
            </View>
            {index < steps.length - 1 && <View style={styles.line} />}
          </React.Fragment>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  stepContainer: {
    alignItems: 'center',
    width: 100, // Ancho para cada paso
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#D1D5DB', // Gris claro
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  activeCircle: {
    borderColor: '#3B82F6', // Azul
    backgroundColor: '#3B82F6',
  },
  completedCircle: {
    borderColor: '#3B82F6',
    backgroundColor: '#FFFFFF',
  },
  stepText: {
    color: '#6B7280', // Gris medio
    fontWeight: 'bold',
  },
  activeStepText: {
    color: '#FFFFFF',
  },
  completedStepText: {
    color: '#3B82F6',
  },
  title: {
    marginTop: 8,
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  activeTitle: {
    color: '#3B82F6',
    fontWeight: 'bold',
  },
  completedTitle: {
    color: '#6B7280',
  },
  line: {
    height: 2,
    backgroundColor: '#D1D5DB',
    flex: 1,
    marginHorizontal: -10,
    marginTop: 15,
  },
});

export default Stepper;
