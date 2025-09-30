import { CommonModule } from '@angular/common'
import { Component, importProvidersFrom, inject } from '@angular/core'
import { Meta, StoryObj, applicationConfig, moduleMetadata } from '@storybook/angular'
import { NwDataService } from '~/data'
import { AppTestingModule } from '~/test'
import { VirtualGridComponent } from '~/ui/data/virtual-grid'
import { PerkGridCellComponent } from './perk-grid-cell.component'
import { VirtualGridCellDirective } from '~/ui/data/virtual-grid/virtual-grid-cell.directive'

@Component({
  standalone: true,
  template: ` <nwb-virtual-grid [options]="options" [data]="items$ | async"></nwb-virtual-grid> `,
  imports: [CommonModule, VirtualGridComponent, VirtualGridCellDirective, PerkGridCellComponent],
  host: {
    class: 'flex flex-col h-[800px] w-full',
  },
})
export class StoryComponent {
  protected items$ = inject(NwDataService).perks
  protected options = PerkGridCellComponent.buildGridOptions()
}

export default {
  title: 'Widgets / nwb-virtual-grid / Perk',
  component: StoryComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [importProvidersFrom(AppTestingModule)],
    }),
    moduleMetadata({
      imports: [StoryComponent],
    }),
  ],
  args: {},
} satisfies Meta<StoryComponent>

export const Example: StoryObj<StoryComponent> = {}
