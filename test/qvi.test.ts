import { SignifyClient, Credentials } from 'signify-ts';
import { describe, expect, it } from '@jest/globals';
import { anyOfClass, capture, instance, mock, verify, when } from 'ts-mockito';
import { QVI } from '../src';
import { Rules } from '../src/rules';
import {
    ECRAuthEdge,
    ECRAuthEdgeData as ECRAuthEdgeData,
    ECRvLEICredentialData,
} from '../src/qvi/credentials/ecr';
import {
    OORAuthEdge,
    OORAuthvLEIEdgeData as OORAuthEdgeData,
    OORvLEICredentialData,
} from '../src/qvi/credentials/oor';
import { credentials } from '../src/credentials';
import { edges } from '../src/edges';

describe('a qvi', () => {
    it('should create legal entity credential', () => {
        let mockedClient: SignifyClient = mock(SignifyClient);

        let c: Credentials = mock(Credentials);
        when(mockedClient.credentials()).thenReturn(instance(c));

        let client = instance(mockedClient);
        let qvi = new QVI(client, 'qvi_name', 'qvi_registry_aid');
        let data = new credentials.LegalEntityCredentialData({
            LEI: 'an LEI',
            issuee: 'issuee',
            timestamp: 'timestamp',
        });
        let edgeData = new edges.LegalEntityCredentialEdgeData({
            qviCredentialSAID: 'said',
        });
        let edge = new edges.LegalEntityCredentialEdge({ qvi: edgeData });

        qvi.createLegalEntityCredential('issuee aid', data, edge);

        let cap = capture(c.issue).last();

        verify(
            c.issue(
                'qvi_name',
                'qvi_registry_aid',
                'ENPXp1vQzRF6JwIuS-mp2U8Uf1MoADoP_GqQ62VsDZWY',
                'issuee aid',
                anyOfClass(credentials.LegalEntityCredentialData),
                Rules.LE,
                anyOfClass(edges.LegalEntityCredentialEdge),
                false
            )
        ).once();

        let DATA_ARG = 4;
        expect(cap[DATA_ARG].LEI).toBe('an LEI');

        let EDGE_ARG = 6;
        expect(cap[EDGE_ARG].d).toBe(
            'EBXFKc37aSCngzHUOX0Rfxq0l2JNS8SBDzzkHamXpkle'
        );
        expect(cap[EDGE_ARG].qvi.n).toBe('said');
        expect(cap[EDGE_ARG].qvi.s).toBe(
            'EBfdlu8R27Fbx-ehrqwImnK-8Cm79sqbAQ4MmvEAYqao'
        );
    });

    it('should create engagement context role credential', () => {
        let mockedClient: SignifyClient = mock(SignifyClient);

        let c: Credentials = mock(Credentials);
        when(mockedClient.credentials()).thenReturn(instance(c));

        let client = instance(mockedClient);
        let qvi = new QVI(client, 'qvi_name', 'qvi_registry_aid');
        let data = new ECRvLEICredentialData({
            issuee: 'issuee',
            nonce: 'nonce',
            timestamp: 'timestamp',
            LEI: 'an LEI',
            personLegalName: 'person legal name',
            engagementContextRole: 'my ocntext role',
        });
        let authData = new ECRAuthEdgeData({
            leCredentialSAID: 'a SAID',
        });
        let edge = new ECRAuthEdge({ auth: authData });

        qvi.createEngagementContextRoleCredential('issuee aid', data, edge);

        let cap = capture(c.issue).last();

        verify(
            c.issue(
                'qvi_name',
                'qvi_registry_aid',
                'EEy9PkikFcANV1l7EHukCeXqrzT1hNZjGlUk7wuMO5jw',
                'issuee aid',
                anyOfClass(ECRvLEICredentialData),
                Rules.ECR,
                anyOfClass(ECRAuthEdge),
                false
            )
        ).once();

        let DATA_ARG = 4;
        expect(cap[DATA_ARG].LEI).toBe('an LEI');

        let EDGE_ARG = 6;
        expect(cap[EDGE_ARG].d).toBe(
            'EO_ctStrce0aXRVzoD6Ej_vn6YCsovl5A-WMLaQGlvzs'
        );
        expect(cap[EDGE_ARG].auth.n).toBe('a SAID');
        expect(cap[EDGE_ARG].auth.s).toBe(
            'ENPXp1vQzRF6JwIuS-mp2U8Uf1MoADoP_GqQ62VsDZWY'
        );
    });

    it('should create official organizational role credential', () => {
        let mockedClient: SignifyClient = mock(SignifyClient);

        let c: Credentials = mock(Credentials);
        when(mockedClient.credentials()).thenReturn(instance(c));

        let client = instance(mockedClient);
        let qvi = new QVI(client, 'qvi_name', 'qvi_registry_aid');
        let data = new OORvLEICredentialData({
            issuee: 'issuee',
            nonce: 'nonce',
            timestamp: 'timestamp',
            LEI: 'an LEI',
            personLegalName: 'person legal name',
            officialOrganizationalRole: 'my official role',
        });
        let authData = new OORAuthEdgeData({
            leCredentialSAID: 'a SAID',
        });
        let edge = new OORAuthEdge({ auth: authData });

        qvi.createOfficialOrganizationRoleCredential('issuee aid', data, edge);

        let cap = capture(c.issue).last();

        verify(
            c.issue(
                'qvi_name',
                'qvi_registry_aid',
                'EBNaNu-M9P5cgrnfl2Fvymy4E_jvxxyjb70PRtiANlJy',
                'issuee aid',
                anyOfClass(OORvLEICredentialData),
                Rules.OOR,
                anyOfClass(OORAuthEdge),
                false
            )
        ).once();

        let DATA_ARG = 4;
        expect(cap[DATA_ARG].LEI).toBe('an LEI');

        let EDGE_ARG = 6;
        expect(cap[EDGE_ARG].d).toBe(
            'EO_ctStrce0aXRVzoD6Ej_vn6YCsovl5A-WMLaQGlvzs'
        );
        expect(cap[EDGE_ARG].auth.n).toBe('a SAID');
        expect(cap[EDGE_ARG].auth.s).toBe(
            'ENPXp1vQzRF6JwIuS-mp2U8Uf1MoADoP_GqQ62VsDZWY'
        );
    });
});
