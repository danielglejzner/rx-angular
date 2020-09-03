import { getStrategies } from '../../../src/lib/render-strategies';
import {
  getMockStrategyConfig,
  testStrategyMethod,
  CallsExpectations
} from '../../fixtures';
import { fakeAsync } from '@angular/core/testing';
// tslint:disable-next-line:nx-enforce-module-boundaries
import { mockConsole } from '@test-helpers';

/**
 * DETACH STRATEGY
 * Coalescing on component scope. Based on detectChange and detach reattach.
 */

const strategyName = 'detach';

const callsExpectations: CallsExpectations = {
  detectChanges: 1,
  markForCheck: 0,
  detach: 1,
  reattach: 1
};

describe('detach Strategy', () => {
  beforeAll(() => mockConsole());

  describe('declaration', () => {
    it('should be present in strategies map', () => {
      const strategy = getStrategies(getMockStrategyConfig())[strategyName];
      expect(strategy).toBeDefined();
    });

    it(`should have ${strategyName} as name`, () => {
      const strategy = getStrategies(getMockStrategyConfig())[strategyName];
      expect(strategy.name).toBe(strategyName);
    });
  });

  describe('rxScheduleCD', () => {
    it('should call cdRef#detectChanges, cdRef#detach, cdRef#reattach 1 times when rxScheduleCD is used with a single sync emission', fakeAsync(() => {
      testStrategyMethod({
        strategyName,
        strategyMethod: 'rxScheduleCD',
        singleTime: true,
        callsExpectations
      }, () => {});
    }));

    it('should call cdRef#detectChanges 1 times when rxScheduleCD is used with multiple sync emissions', fakeAsync(() => {
      testStrategyMethod({
        strategyName,
        strategyMethod: 'rxScheduleCD',
        singleTime: false,
        callsExpectations
      }, () => {});
    })
    );
  });

  xdescribe('scheduleCD', () => {
    it('should call cdRef#detectChanges 1 times when scheduleCD is called a single time', fakeAsync(() => {
      testStrategyMethod({
        strategyName,
        strategyMethod: 'scheduleCD',
        singleTime: true,
        callsExpectations
      });
    }));

    it(`should call cdRef#detectChanges 1 times when scheduleCD is called multiple times sync`, fakeAsync(() => {
        testStrategyMethod({
          strategyName,
          strategyMethod: 'scheduleCD',
          singleTime: false,
          callsExpectations
        });
      })
    );
  });

  xdescribe('combined scheduleCD & rxScheduleCD', () => {
    it('should call strategy#detectChanges 1 times when scheduleCD or rxScheduleCD is called', fakeAsync(() => {
        testStrategyMethod({
          strategyName,
          strategyMethod: 'rxScheduleCD',
          singleTime: false,
          callsExpectations
        }, () => {});

        testStrategyMethod({
          strategyName,
          strategyMethod: 'scheduleCD',
          singleTime: false,
          callsExpectations
        });
      })
    );
  });
});