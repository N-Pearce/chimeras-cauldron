import App from './App'
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom';
import {BrowserRouter, MemoryRouter} from 'react-router-dom'
import Supabase from './api-homebrew/Supabase';


// test('jest runs correctly', () => {
//   const OLD_ENV = process.env
//   console.log(OLD_ENV)
//   jest.resetModules()
//   process.env = { ...OLD_ENV}
//   console.log(OLD_ENV.API_URL)
//   console.log(process.env.BASE_URL)
// })

test('homepage/signed out navbar rendering/navigating', async () => {
  render(<App />)
  const user = userEvent.setup()

  // verify page content for default route
  expect(screen.getByText(/Chimera's Cauldron!/i)).toBeInTheDocument()
  expect(screen.getByText(/Welcome/i)).toBeInTheDocument()
  expect(screen.getAllByText(/login/i).length).toEqual(2)
  expect(screen.getAllByText(/signup/i).length).toEqual(2)
  expect(screen.getByText(/copyright notice/i)).toBeInTheDocument()

  // verify page content for login path
  await user.click(screen.getAllByText(/login/i)[0])
  expect(screen.getByText(/username/i)).toBeInTheDocument()
  expect(screen.getByText(/password/i)).toBeInTheDocument()
  expect(screen.queryByText(/first name/i)).not.toBeInTheDocument()
  expect(screen.queryByText(/last name/i)).not.toBeInTheDocument()
  expect(screen.queryByText(/email/i)).not.toBeInTheDocument()
  expect(screen.getByText(/submit/i)).toBeInTheDocument()
  
  // verify page content for signup path
  await user.click(screen.getAllByText(/signup/i)[0])
  expect(screen.getByText(/username/i)).toBeInTheDocument()
  expect(screen.getByText(/password/i)).toBeInTheDocument()
  expect(screen.getByText(/first name/i)).toBeInTheDocument()
  expect(screen.getByText(/last name/i)).toBeInTheDocument()
  expect(screen.getByText(/email/i)).toBeInTheDocument()
  expect(screen.getByText(/submit/i)).toBeInTheDocument()

  // return to default route, verify
  await user.click(screen.getAllByText(/home/i)[0])
  expect(screen.getByText(/Chimera's Cauldron!/i)).toBeInTheDocument()
  expect(screen.getByText(/Welcome/i)).toBeInTheDocument()
  expect(screen.getAllByText(/login/i).length).toEqual(2)
  expect(screen.getAllByText(/signup/i).length).toEqual(2)
  expect(screen.getByText(/copyright notice/i)).toBeInTheDocument()
  
  // verify page content for copyright notice path
  await user.click(screen.getAllByText(/copyright notice/i)[0])
  console.log(screen.getAllByText(/Copyright notice/i).length)
  expect(screen.getAllByText(/Copyright notice/i).length).toEqual(2)
  expect(screen.getByText(/The following Open Gaming License is for all spells and items that appear within this site that do NOT include a tag that says "Made by/i))
    .toBeInTheDocument()
  expect(screen.getByText(/OPEN GAME LICENSE Version 1.0a/i))
    .toBeInTheDocument()
  expect(screen.getByText(/15. COPYRIGHT NOTICE Open Game License v 1.0a Copyright 2000, Wizards of the Coast, LLC./i))
    .toBeInTheDocument()
    
  await user.click(screen.getAllByText(/home/i)[0])
  expect(screen.getAllByText(/signup/i).length).toEqual(2)
})


test('signup and login', async () => {
  render(<App />)

  const user = userEvent.setup()

  await user.click(screen.getAllByText(/login/i)[0])
  await user.click(screen.getByLabelText(/Username/i))
  await user.paste("greggy")
  await user.click(screen.getByLabelText(/Password/i))
  await user.paste("ilikeknives")
  await user.click(screen.getByText(/submit/i))


  
  console.log(await Supabase.getUser("greggy"))
  await user.click(screen.getByText(/home/i))
  expect(screen.getByText(/copyright notice/i)).toBeInTheDocument()

  

})

test('jest runs correctly', () => {
  expect(1+1).toEqual(2)
})