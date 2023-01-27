/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contract'

describe('Testes da Funcionalidade Usuários', () => {
     let token
     before(() => {
          cy.token('pedro_felix@qa.com.br', 'pedro@123').then(tkn => { token = tkn })
     });

     it('Deve validar contrato de usuários', () => {
          cy.request('usuarios').then(resposta => {
               return contrato.validateAsync(resposta.body)
          })
     });

     it('Deve listar usuários cadastrados', () => {
          cy.request({
               method: 'GET',
               url: 'usuarios'
          }).then((resposta) => {
               expect(resposta.status).to.equal(200)
               expect(resposta.body).to.have.property('usuarios')
          })
     });

     it('Deve cadastrar um usuário com sucesso', () => {
          let usuario = `Usuario Novo ${Math.floor(Math.random() * 1000)}`
          let usuarioEmail = `user${Math.floor(Math.random() * 1000)}@teste.com`

          cy.request({
               method: 'POST',
               url: 'usuarios',
               body: {
                    "nome": usuario,
                    "email": usuarioEmail,
                    "password": "pedro@123",
                    "administrador": "true"
               },
               headers: { authorization: token }
          }).then((resposta) => {
               expect(resposta.status).to.equal(201)
               expect(resposta.body.message).to.equal('Cadastro realizado com sucesso')
          })
     });

     it('Deve validar um usuário com email inválido', () => {
          cy.cadastrarUsuario('Pedro H Teste', 'pedro_1@qa.com.br', 'teste@123', 'true', token)
               .then((resposta) => {
                    expect(resposta.status).to.equal(400)
                    expect(resposta.body.message).to.equal('Este email já está sendo usado')
               })
     });

     it('Deve editar um usuário previamente cadastrado', () => {
          let novoUsuario = `Usuario Teste ${Math.floor(Math.random() * 1000)}`
          let usuarioEmail = `user${Math.floor(Math.random() * 1000)}@teste.com`
          cy.cadastrarUsuario(novoUsuario, usuarioEmail, 'teste@123', 'true', token)
               .then(reposta => {
                    let id = reposta.body._id

                    cy.request({
                         method: 'PUT',
                         url: `usuarios/${id}`,
                         headers: { authorization: token },
                         body:
                         {
                              "nome": novoUsuario,
                              "email": usuarioEmail,
                              "password": "pedro@123",
                              "administrador": "true"
                         }
                    }).then(reposta => {
                         expect(reposta.body.message).to.equal('Registro alterado com sucesso')
                    })
               });
     });

     it('Deve deletar um usuário previamente cadastrado', () => {
          let novoUsuario = `Usuario Teste ${Math.floor(Math.random() * 1000)}`
          let usuarioEmail = `user${Math.floor(Math.random() * 1000)}@teste.com`
          cy.cadastrarUsuario(novoUsuario, usuarioEmail, 'teste@123', 'true', token)
               .then(reposta => {
                    let id = reposta.body._id
                    cy.request({
                         method: 'DELETE',
                         url: `usuarios/${id}`,
                         headers: { authorization: token }
                    }).then(reposta => {
                         expect(reposta.body.message).to.equal('Registro excluído com sucesso')
                         expect(reposta.status).to.equal(200)
                    })


               });
     });
});

