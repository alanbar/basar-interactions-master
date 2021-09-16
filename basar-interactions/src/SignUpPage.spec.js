import SignUpPage from "./SignUpPage.svelte"
import { render, screen }  from "@testing-library/svelte"
import { waitFor } from "@testing-library/dom"
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event"
//import axios from 'axios'
import "whatwg-fetch" // polyfills fetch 
import { setupServer } from "msw/node"
import { rest } from "msw"


describe("Sign Up Page", () => {
    describe("Layout", () => {
        it("has Sign Up header", () => {
            render(SignUpPage)
            const header = screen.getByRole("heading", { name: "Sign Up"})
            expect(header).toBeInTheDocument()
            // getByText("Sign Up").not.toBeNull()
        })
        it("has username input", () => {
            render(SignUpPage)
            const input = screen.getByLabelText("Username")
            expect(input).toBeInTheDocument()
        })
        it("has email input", () => {
            render(SignUpPage)
            const input = screen.getByLabelText("E-mail")
            expect(input).toBeInTheDocument()
        })
        it("has password input", () => {
            render(SignUpPage)
            const input = screen.getByLabelText("Password")
            expect(input).toBeInTheDocument()
        })

        it("has password type", () => {
            render(SignUpPage)
            const input = screen.getByLabelText("Password")
            expect(input.type).toBe("password")
        })
        it("has password repeat", () => {
            render(SignUpPage)
            const input = screen.getByLabelText("Password Repeat")
            expect(input).toBeInTheDocument()
        })

        it("has password type for repeat input", () => {
            render(SignUpPage)
            const input = screen.getByLabelText("Password Repeat")
            expect(input.type).toBe("password")
        })
        it("has Sign Up button", () => {
            render(SignUpPage)
            const button = screen.getByRole("button", { name: "Sign Up"})
            expect(button).toBeInTheDocument()
        })
        it("disables the button initially", () => {
            render(SignUpPage)
            const button = screen.getByRole("button", { name: "Sign Up"})
            expect(button).toBeDisabled()
        })
    })
    describe("Interactions", () => {
        //  let requestBody
        //  let counter = 0
        //  const server = setupServer(
        //     rest.post("/api/1.0/users", (req, res, ctx) => {
        //         requestBody = req.body
        //         counter += 1
        //         return res(ctx,status(200))
        //     })
        // )

        // beforeAll(() => server.listen())
        // afterAll(() => server.close())
        
        // let button
        const setup = async  () => {
            render(SignUpPage);
            const usernameInput = screen.getByLabelText("Username");
            const emailInput = screen.getByLabelText("E-mail");
            const passwordInput = screen.getByLabelText("Password");
            const passwordRepeatInput = screen.getByLabelText("Password Repeat");
            
            await userEvent.type(usernameInput, "user1");
            await userEvent.type(emailInput, "user1@mail.com");
            await userEvent.type(passwordInput, "P4ssword");
            await userEvent.type(passwordRepeatInput, "P4ssword"); 
        }

        
        it("displays account activation info after successful sign up request",
            async () => {
            
            const server = setupServer(
                    rest.post("/api/1.0/users", (req, res, ctx) => {
                        
                        return res(ctx.status(200))
                    })
            )
            
            server.listen()
            await setup()
            const button = screen.getByRole("button", { name: "Sign Up"})             
            await userEvent.click(button);
            await server.close()  

            const text = await screen.findByText("Please check your e-mail to activate your account")
            expect(text).toBeInTheDocument()
            
                       
            });

        it("enables the button when password & repeat have the same value", 
        async () => {
            await setup()
            const button = screen.getByRole("button", { name: "Sign Up"})
            expect(button).not.toBeDisabled()
        })

        it("sends username, email, password to b/end after clicking the button",
        async () => {
            
            let requestBody
         
            const server = setupServer(
            rest.post("/api/1.0/users", (req, res, ctx) => {
                requestBody = req.body
                return res(ctx.status(200))
            })
        )

            server.listen()

            await setup()
            const button = screen.getByRole("button", { name: "Sign Up"})             
            await userEvent.click(button);
            await server.close()
            // await screen.findByText(
            //     "Please check your e-mail to activate your account"
            // )
            
            expect(requestBody).toEqual({
              "username": "user1",
              "email": "user1@mail.com",
              "password": "P4ssword",
            });
        });

        it("disables button when there is an ongoing api call",
        async () => {
              
                let requestBody
                let counter = 0
                const server = setupServer(
                    rest.post("/api/1.0/users", (req, res, ctx) => {
                        requestBody = req.body
                        counter += 1
                        return res(ctx.status(200))
                    })
                )

                server.listen(

                )
              await setup()
              const button = screen.getByRole("button", { name: "Sign Up"})         
              await userEvent.click(button);
              await userEvent.click(button);
              await server.close()
            //   await screen.findByText(
            //     "Please check your e-mail to activate your account"
            // )
              expect(counter).toBe(1)
                
              });

        it("displays spinner while api request is in progress",
         async () => {
            
            const server = setupServer(
                rest.post("/api/1.0/users", (req, res, ctx) => {
                    return res(ctx.status(200))
                })
            )
            server.listen()
            await setup()
            const button = screen.getByRole("button", { name: "Sign Up"})             
            await userEvent.click(button);
                        
            const spinner = screen.getByTestId("spinner")
            //const spinner = screen.getByRole("status")
            expect(spinner).toBeInTheDocument()
            
                       
            });

            it("does not display spinner when there is no api request",
            async () => {
               
               await setup()
               
               //const spinner = screen.queryByTestId("spinner")
               const spinner = screen.queryByRole("status")
               expect(spinner).not.toBeInTheDocument()
               
                          
            }); 
            
            

            it("does not display account activation msg before sign up request",
            async () => {
               
                const server = setupServer(
                    rest.post("/api/1.0/users", (req, res, ctx) => {
                        
                        return res(ctx.status(400))
                    })
                ) 
               await setup()
               const button = screen.getByRole("button", { name: "Sign Up"}) 
               const text = await screen.queryByText("Please check your e-mail to activate your account")
               expect(text).not.toBeInTheDocument()
               
                          
            }); 

           

            it("hides sign up form after successful sign up request",
            async () => {
            
            const server = setupServer(
                    rest.post("/api/1.0/users", (req, res, ctx) => {
                        
                        return res(ctx.status(200))
                    })
                )
            server.listen()
            await setup()
                        
            const form = screen.getByTestId("form-sign-up")
            const button = screen.getByRole("button", { name: "Sign Up"}) 
            await userEvent.click(button);
             
            await waitFor(() => {
                expect(form).not.toBeInTheDocument()
            }) 

                                   
            });

            

            it("does not display account activation info after failing sign up request",
            async () => {
            
            const server = setupServer(
                    rest.post("/api/1.0/users", (req, res, ctx) => {
                        return res(ctx.status(200))
                    })
            )
            
            server.listen()    
            await setup()
            
            const button = screen.getByRole("button", { name: "Sign Up"})
            await userEvent.click(button);
            await server.close()

            const text = screen.queryByText("Please check your e-mail to activate your account")
            expect(text).not.toBeInTheDocument()
            
                       
            });
    })
})


