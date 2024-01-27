import { HandPalm, Play } from "phosphor-react";
import { HomeContainer, StartCountdownButton, StopCountdownButton } from "./styles";
import { useContext } from "react";
import * as zod from 'zod';
import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CyclesContext } from "../../contexts/CyclesContext";



const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod
    .number()
    .min(5, { message: 'Mínimo de 5 minutos' })
    .max(60, { message: 'Máximo de 60 minutos' }),
})
type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>


export default function Home() {

  const { createNewCycle, interruptCurrentCycle, activeCycle } = useContext(CyclesContext)


  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(
      newCycleFormValidationSchema
    ),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    }
  })

  const { handleSubmit, reset, watch } = newCycleForm

  function hancleCreateNewCycle(data: NewCycleFormData) {
    createNewCycle(data)
    reset()
  }

  const task = watch('task')
  const isSubmitButtonDisabled = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(hancleCreateNewCycle)} action="">

        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>
        <Countdown />

        {activeCycle ? (
          <StopCountdownButton onClick={interruptCurrentCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitButtonDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}