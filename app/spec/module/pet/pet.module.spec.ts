import type { PetResponse, RemovePetResponse } from '@/module/pet/pet.response'
import { Gender } from '@/module/pet/type/gender'
import { Size } from '@/module/pet/type/size'

import { Spec } from '../spec'

describe('pet module', async () => {
  const spec = await Spec.build()

  beforeAll(async () => {
    await spec.start()

    await spec.scenario.pet()
  })

  // list /pet
  describe('/pet', () => {
    test('should list pet', async () => {
      const {
        authorization: { token: { hash } = { hash: '' } }
      } = spec.scenario

      await spec.scenario.build.pet.create()

      const { json } = await spec.application
        .inject()
        .get('/pet')
        .headers({ Authorization: `Bearer ${hash}` })
        .query({ page: '1', amount: '10' })
        .end()

      const response = json<PetResponse[]>()

      expect(response).toHaveLength(1)

      expect(response).toMatchObject([
        {
          id: expect.any(String),
          name: 'Oreo',
          size: Size.MEDIUM,
          gender: Gender.MALE,
          breed: {
            id: expect.any(String),
            name: 'Buldogue Inglês'
          }
        }
      ])
    })
  })

  // get /pet/id
  describe('/pet/id', () => {
    test('should get pet', async () => {
      const {
        authorization: { token: { hash } = { hash: '' } }
      } = spec.scenario

      const { id: pet } = await spec.scenario.build.pet.create()

      const { json } = await spec.application
        .inject()
        .get(`/pet/${pet}`)
        .headers({ Authorization: `Bearer ${hash}` })
        .end()

      const response = json<PetResponse>()

      expect(response).toMatchObject({
        id: pet,
        name: 'Oreo',
        size: Size.MEDIUM,
        gender: Gender.MALE,
        breed: {
          id: expect.any(String),
          name: 'Buldogue Inglês'
        }
      })
    })
  })

  // post /pet
  describe('/pet', () => {
    test('should create pet', async () => {
      const {
        authorization: { token: { hash } = { hash: '' } }
      } = spec.scenario

      const list = await spec.scenario.build.breed.list()

      const { id: breed } = list.find((e) => e.name === 'Buldogue Inglês') ?? { id: null }

      const { json } = await spec.application
        .inject()
        .post('/pet')
        .headers({ Authorization: `Bearer ${hash}` })
        .body({
          name: 'Oreo',
          size: Size.MEDIUM,
          gender: Gender.MALE,
          breed: breed
        })
        .end()

      const response = json<PetResponse>()

      expect(response).toMatchObject({
        id: expect.any(String),
        name: 'Oreo',
        size: Size.MEDIUM,
        gender: Gender.MALE,
        breed: {
          id: expect.any(String),
          name: 'Buldogue Inglês'
        }
      })
    })
  })

  // put /pet/id
  describe('/pet/id', () => {
    test('should save pet', async () => {
      const {
        authorization: { token: { hash } = { hash: '' } }
      } = spec.scenario

      const { id } = await spec.scenario.build.pet.create()

      const list = await spec.scenario.build.breed.list()

      const { id: breed } = list.find((e) => e.name === 'Sem Raça Definida') ?? { id: null }

      const { json } = await spec.application
        .inject()
        .put(`/pet/${id}`)
        .headers({ Authorization: `Bearer ${hash}` })
        .body({
          name: 'Estopinha',
          size: Size.MEDIUM,
          gender: Gender.FEMALE,
          breed: breed
        })
        .end()

      const response = json<PetResponse>()

      expect(response).toMatchObject({
        name: 'Estopinha',
        size: Size.MEDIUM,
        gender: Gender.FEMALE,
        breed: {
          id: expect.any(String),
          name: 'Sem Raça Definida'
        }
      })
    })
  })

  // delete /pet/id
  describe('/pet/id', () => {
    test('should remove pet', async () => {
      const {
        authorization: { token: { hash } = { hash: '' } }
      } = spec.scenario

      const { id: pet } = await spec.scenario.build.pet.create()

      const { json } = await spec.application
        .inject()
        .delete(`/pet/${pet}`)
        .headers({ Authorization: `Bearer ${hash}` })
        .end()

      const response = json<RemovePetResponse>()

      expect(response).toMatchObject({
        id: pet
      })
    })
  })

  afterAll(async () => {
    await spec.stop()
  })
})
